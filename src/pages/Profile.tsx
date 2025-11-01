import { useEffect, useState } from "react";
import { Card, Form, Input, Switch, Button, message, Spin } from "antd";
import { supabase } from "../lib/supabaseClient";
import Header from "../components/Header";

export default function ProfilePage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        message.error("Unable to load user email");
        setEmail(null);
      } else {
        setEmail(data.user.email);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      message.success("Profile updated (test)");
      setSaving(false);
    }, 800);
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
                      email_notifications: true,
                      sms_notifications: false,
                  }}
              >
                  <Form.Item label="Email (read-only)">
                      <Input value={email || "No email found"} readOnly />
                  </Form.Item>

                  <Form.Item
                      label="Full Name"
                      name="full_name"
                      rules={[{ required: true, message: "Please enter your full name" }]}
                  >
                      <Input placeholder="Your name" />
                  </Form.Item>

                  <Form.Item label="Notification Preferences" style={{ marginBottom: 8 }}>
                      <Form.Item
                          name="email_notifications"
                          valuePropName="checked"
                          style={{ marginBottom: 4 }}
                      >
                          <Switch checkedChildren="Email On" unCheckedChildren="Email Off" />{" "}
                          <span style={{ marginLeft: 8 }}>Email Notifications</span>
                      </Form.Item>

                      <Form.Item
                          name="sms_notifications"
                          valuePropName="checked"
                          style={{ marginBottom: 0 }}
                      >
                          <Switch checkedChildren="SMS On" unCheckedChildren="SMS Off" />{" "}
                          <span style={{ marginLeft: 8 }}>SMS Notifications</span>
                      </Form.Item>
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
