import { useEffect, useState } from "react";
import { Card, Form, Input, Switch, Button, message, Spin } from "antd";
import { supabase } from "../lib/supabaseClient";
import Header from "../components/header";

export default function ProfilePage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // need to test phone number field by getting texts sent to the user **
  // could impliment profile picture upload? 
  // password change from inside?
  // email fetches from supabase and cannot be changed at the moment. should it be able to be changed and then updated in the auth?

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        message.error("Unable to load user information");
        setLoading(false);
        return;
      }

      const user = userData.user;
      setUserId(user.id);
      setEmail(user.email);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code === "PGRST116") {
        console.warn("No profile found. Creating new record...");

        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          phone_number: "",
          full_name: "",
          email_notifications: false,
          sms_notifications: false,
        });

        if (insertError) {
          console.error("Failed to create new profile:", insertError.message);
          message.error("Failed to create profile record.");
        } else {
          console.log("✅ Created new profile for:", user.email);
        }
      } else if (profileError) {
        console.error("Failed to load profile:", profileError.message);
        message.warning("Profile load error, using default values");
      }

      form.setFieldsValue({
        full_name: profile?.full_name || "",
        phone_number: profile?.phone_number || "",
        email_notifications: profile?.email_notifications ?? false,
        sms_notifications: profile?.sms_notifications ?? false,
        campus_preference: profile?.campus_preference || "all",
        dietary_preferences: profile?.dietary_preferences || [],
      });

      setAvatarUrl(profile?.avatar_url || null)
      setLoading(false);
    };

    fetchProfile();
  }, [form]);

  // added this whole function
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      message.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error('Image must be smaller than 5MB');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar.${fileExt}`;

      // Delete old avatar if exists
      if (avatarUrl) {
        const oldPath = avatarUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('avatars').remove([`${userId}/${oldPath}`]);
        }
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      message.success('Profile picture updated!');
    } catch (error) {
      console.error('Avatar upload error:', error);
      message.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };
  // up to here
  const handleSave = async (values: any) => {


    if (!userId) {
      message.error("User not loaded yet");
      return;
    }
    console.log("Form values before save:", values);
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: values.full_name,
        phone_number: values.phone_number,
        email_notifications: values.email_notifications,
        sms_notifications: values.sms_notifications,
        campus_preference: values.campus_preference,
        dietary_preferences: values.dietary_preferences,
      })
      .eq("id", userId);

    if (error) {
      console.error("Update failed:", error.message);
      message.error("Failed to update profile");
    } else {
      message.success("Profile updated successfully!");
    }

    setSaving(false);
  };


  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#fafafa",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Card
          title="Profile Settings"
          style={{
            width: 500,
            borderRadius: 12,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          {/* jsut added this */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
            <Avatar
              style={{ width: 120, height: 120, cursor: 'pointer' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <AvatarImage src={avatarUrl || undefined} alt="Profile" />
              <AvatarFallback style={{ fontSize: 48 }}>
                {form.getFieldValue('full_name')?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: 'none' }}
            />
            <Button
              type="link"
              icon={<Upload size={16} />}
              onClick={() => fileInputRef.current?.click()}
              loading={uploading}
              style={{ marginTop: 8 }}
            >
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </Button>
          </div>
          {/* up to here */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{
              full_name: "Jane Doe",
              phone_number: "999-999-9999",
              email_notifications: true,
              sms_notifications: false,
            }}
          >
            <Form.Item label="Email:">
              <Input value={email || "No email found"} readOnly />
            </Form.Item>

            <Form.Item
              label="Full Name"
              name="full_name"
              rules={[{ required: true, message: "Please enter your full name" }]}
            >
              <Input placeholder="Your name" />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phone_number"
              rules={[{ required: true, message: "Please enter your phone number" }]}
            >
              <Input placeholder="+1 (999) 999-9999" />
              </Form.Item>

            <Form.Item
              label="Email Notifications"
              name="email_notifications"
              valuePropName="checked"
            >
              <Switch checkedChildren="Email On" unCheckedChildren="Email Off" />
            </Form.Item>

            <Form.Item
              label="SMS Notifications"
              name="sms_notifications"
              valuePropName="checked"
            >
              <Switch checkedChildren="SMS On" unCheckedChildren="SMS Off" />
            </Form.Item>



            <div style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit" loading={saving} 
              style={{
              backgroundColor: "#CC0000",
              borderColor: "#CC0000",
              }}>
                Save Changes
              </Button>
            </div>
          </Form>
        </Card>
      </div></>
  );
}
