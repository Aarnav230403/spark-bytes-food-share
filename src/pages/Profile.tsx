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

  // need to impliment text box for phone 
  // could impliment profile picture upload? password change from inside?
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
      });

      setLoading(false);
    };

    fetchProfile();
  }, [form]);

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
              <Button type="primary" htmlType="submit" loading={saving}>
                Save Changes
              </Button>
            </div>
          </Form>
        </Card>
      </div></>
  );
}
