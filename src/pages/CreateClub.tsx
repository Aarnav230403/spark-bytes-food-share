"use client";
import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  message,
  Upload,
  List,
} from "antd";
import { PlusOutlined, InboxOutlined } from "@ant-design/icons";
import { supabase } from "../lib/supabaseClient";

type CreateClubModalProps = {
  // accept either prop name to be robust to different calling code / antd versions
  open?: boolean;
  visible?: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

const campuses = [
  { name: "West", url: "https://maps.bu.edu/?id=647#!ce/29650?m/561519?s/west?sbc/" },
  { name: "Central", url: "https://maps.bu.edu/?id=647#!ce/29650?m/561518?s/central?sbc/" },
  { name: "East", url: "https://maps.bu.edu/?id=647#!ce/29650?m/561520?s/east?sbc/" },
  { name: "South", url: "https://maps.bu.edu/?id=647#!ce/29650?m/567638?s/south%20?sbc/" },
  { name: "Fenway", url: "https://maps.bu.edu/?id=647#!ce/29650?m/583837?s/fenway?sbc/" },
  { name: "Medical", url: "https://maps.bu.edu/?id=647#!ce/33597?m/583838?s/medical?sbc/" }
];

export default function CreateClubModal({ open, visible, onClose, onCreated }: CreateClubModalProps) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // support either prop name (open vs visible)
  const isOpen = open ?? visible ?? false;

  // small debug to confirm the prop is arriving
  useEffect(() => {
    // comment this out after debugging
    // eslint-disable-next-line no-console
    console.log("CreateClubModal isOpen:", isOpen);
  }, [isOpen]);

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags((p) => [...p, t]);
    setTagInput("");
  };

  const removeTag = (t: string) => setTags((p) => p.filter((x) => x !== t));

  const beforeUploadLogo = (file: File) => {
    setLogoFile(file);
    // return false to prevent antd from auto-uploading
    return false;
  };

  const uploadLogoToSupabase = async (file: File) => {
    if (!file) return null;
    setUploadingLogo(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `logo_${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("club-logos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase storage upload error:", uploadError);
        throw uploadError;
      }

      const { data: publicData } = supabase.storage
        .from("club-logos")
        .getPublicUrl(data.path);

      return publicData.publicUrl;
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setSubmitting(false);
      message.error("Please log in first");
      return;
    }

    try {
      let logoUrl: string | null = null;
      if (logoFile) {
        try {
          const uploadedUrl = await uploadLogoToSupabase(logoFile);
          logoUrl = uploadedUrl;
        } catch (err) {
          message.error("Failed to upload logo. Club will still be created without a logo.");
          console.error("Logo upload error:", err);
          logoUrl = null;
        }
      }

      const newClub = {
        name: values.name,
        logo_url: logoUrl,
        category: values.category || null,
        description: values.description || null,
        campus_focus: values.campus || null,
        tags: `{${tags.join(",")}}`,
        website: values.website || null,
        contact_email: values.contactEmail || null,
        created_at: new Date().toISOString(),
        created_by: user.id,
      };

      const { error } = await supabase.from("clubs").insert([newClub]);

      if (error) {
        console.error("Supabase insert error (clubs):", error);
        message.error(`Error creating club: ${error.message}`);
      } else {
        message.success("Club created!");
        form.resetFields();
        setTags([]);
        setLogoFile(null);
        onClose();
        onCreated?.();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      // pass both props to be compatible with different antd versions; harmless if the Modal ignores one
      open={isOpen}
      visible={isOpen}
      onCancel={onClose}
      footer={null}
      title="Create Club"
      centered
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Club Name"
          name="name"
          rules={[{ required: true, message: "Please enter a club name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Category" name="category">
          <Select placeholder="Select a category" allowClear>
            <Select.Option value="Academic">Academic</Select.Option>
            <Select.Option value="Social">Social</Select.Option>
            <Select.Option value="Sports">Sports</Select.Option>
            <Select.Option value="Arts">Arts</Select.Option>
            <Select.Option value="Service">Service</Select.Option>
            <Select.Option value="Other">Other</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} placeholder="Short description of the club" />
        </Form.Item>

        <Form.Item
          label="Campus Location:"
          name="campus"
          rules={[{ required: true, message: "Please select a campus" }]}
        >
          <Select placeholder="Select a campus">
            {campuses.map((c) => (
              <Select.Option key={c.name} value={c.name}>
                {c.name} Campus
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div style={{ marginTop: 2, marginBottom: 8, fontSize: 12, color: "#666" }}>
          View campus locations:{" "}
          {campuses.map((c, idx) => (
            <span key={c.name}>
              {idx > 0 && " • "}
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#8ec4f6ff" }}
              >
                {c.name}
              </a>
            </span>
          ))}
        </div>

        <Form.Item label="Tags (e.g. tech, food, volunteering)">
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <Input
              placeholder="Add a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onPressEnter={(e) => {
                e.preventDefault();
                addTag();
              }}
            />
            <Button onClick={addTag} icon={<PlusOutlined />}>
              Add
            </Button>
          </div>

          <List
            dataSource={tags}
            renderItem={(t) => (
              <List.Item
                actions={[
                  <Button type="link" danger onClick={() => removeTag(t)} key={`rm-${t}`}>
                    Remove
                  </Button>,
                ]}
                key={t}
              >
                {t}
              </List.Item>
            )}
          />
        </Form.Item>

        <Form.Item label="Logo (optional)">
          <Upload
            beforeUpload={beforeUploadLogo}
            accept="image/*"
            maxCount={1}
            showUploadList={{
              showPreviewIcon: false,
              showDownloadIcon: false,
            }}
            fileList={logoFile ? [{ uid: "logo", name: logoFile.name, size: logoFile.size } as any] : []}
            onRemove={() => setLogoFile(null)}
            listType="picture"
          >
            <Button icon={<InboxOutlined />}>Select logo file</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Website" name="website">
          <Input placeholder="(optional)" />
        </Form.Item>

        <Form.Item label="Contact Email" name="contactEmail">
          <Input placeholder="(optional)" />
        </Form.Item>

        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting || uploadingLogo}
            style={{ backgroundColor: "#CC0000", borderColor: "#CC0000" }}
          >
            Create Club
          </Button>
        </div>
      </Form>
    </Modal>
  );
}