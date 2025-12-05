"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Checkbox,
  List,
  message,
  TimePicker,
  DatePicker,
  Select,
} from "antd";
import { supabase } from "../lib/supabaseClient";

type CreateEventModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export default function CreateEventModal({ open, onClose, onCreated }: CreateEventModalProps) {
  const [form] = Form.useForm();
  const [foodItems, setFoodItems] = useState<{ id: string; name: string; qty: number }[]>([]);
  const [foodName, setFoodName] = useState("");
  const [foodQty, setFoodQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [clubs, setClubs] = useState<{ id: number; name: string }[]>([]);
  const [loadingClubs, setLoadingClubs] = useState(false);

  const dietary = ["Vegan","Gluten Free","Vegetarian","Halal","Kosher","Nut Free","Shellfish"];
  const campuses = [
    { name: "West", url: "https://maps.bu.edu/?id=647#!ce/29650?m/561519?s/west?sbc/" },
    { name: "Central", url: "https://maps.bu.edu/?id=647#!ce/29650?m/561518?s/central?sbc/" },
    { name: "East", url: "https://maps.bu.edu/?id=647#!ce/29650?m/561520?s/east?sbc/" },
    { name: "South", url: "https://maps.bu.edu/?id=647#!ce/29650?m/567638?s/south%20?sbc/" },
    { name: "Fenway", url: "https://maps.bu.edu/?id=647#!ce/29650?m/583837?s/fenway?sbc/" },
    { name: "Medical", url: "https://maps.bu.edu/?id=647#!ce/33597?m/583838?s/medical?sbc/" }
  ];

  useEffect(() => {
    if (!open) return;
    const fetchClubs = async () => {
      setLoadingClubs(true);
      const { data, error } = await supabase.from("clubs").select("id,name").order("name",{ ascending: true });
      if (error) {
        setClubs([]);
        message.error("Could not load clubs");
      } else {
        setClubs(data || []);
      }
      setLoadingClubs(false);
    };
    fetchClubs();
  }, [open]);

  const addFood = () => {
    if (!foodName.trim()) return;
    setFoodItems(prev => [...prev, { id: Date.now().toString(), name: foodName.trim(), qty: foodQty }]);
    setFoodName("");
    setFoodQty(1);
  };

  const removeFood = (id: string) => setFoodItems(prev => prev.filter(f => f.id !== id));

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      setSubmitting(false);
      message.error("Please log in first");
      return;
    }

    // Check if club exists if user typed a value
    if (values.club) {
      const clubExists = clubs.some(c => c.name.toLowerCase() === values.club.toLowerCase());
      if (!clubExists) {
        message.error("Club does not exist. Please create the club first.");
        setSubmitting(false);
        return;
      }
    }

    const newEvent = {
      title: values.title,
      club_host: values.club || null,
      location: values.location,
      date: values.date?.format("YYYY-MM-DD"),
      start_time: values.start?.format("h:mm A"),
      end_time: values.end?.format("h:mm A"),
      dietary: `{${(values.dietary || []).join(",")}}`,
      campus: values.campus,
      food_items: foodItems.map(f => ({ name: f.name, qty: f.qty })),
      created_at: new Date().toISOString(),
      created_by: user.id,
    };

    const { error } = await supabase.from("events").insert([newEvent]);
    if (error) {
      message.error(`Error creating event: ${error.message}`);
    } else {
      message.success("Event created!");
      form.resetFields();
      setFoodItems([]);
      onClose();
      onCreated?.();
    }
    setSubmitting(false);
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Create Event" centered width={600} destroyOnClose>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Event Title" name="title" rules={[{ required: true, message: "Please enter a title" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Hosting Club" name="club">
          <Select
            showSearch
            allowClear
            placeholder="Begin typing to search clubs"
            loading={loadingClubs}
            options={clubs.map(c => ({ label: c.name, value: c.name }))}
            dropdownMatchSelectWidth={false}
            filterOption={(input, option) =>
              (option?.label || "").toLowerCase().includes((input || "").toLowerCase())
            }
          />
          <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
            If your club is not listed, please create it first.
          </div>
        </Form.Item>


        <Form.Item label="Campus Location" name="campus" rules={[{ required: true, message: "Please select a campus location" }]}>
          <Select placeholder="Select a campus">
            {campuses.map(c => (
              <Select.Option key={c.name} value={`${c.name} Campus`}>
                {c.name} Campus
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Location" name="location" rules={[{ required: true, message: "Please enter a location" }]}>
          <Input onChange={(e) => setLocationInput(e.target.value)} placeholder="123 Main St, Boston" />
        </Form.Item>

        {locationInput.trim() && (
          <div style={{ marginBottom: 16 }}>
            <iframe
              title="location-map-preview"
              src={`https://www.google.com/maps?q=${encodeURIComponent(locationInput)}&z=15&output=embed`}
              width="100%"
              height="250"
              style={{ border: 0, borderRadius: 8 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        <Form.Item label="Event Date" name="date" rules={[{ required: true, message: "Please select a date" }]}>
          <DatePicker format="MMMM D, YYYY" style={{ width: "100%" }} />
        </Form.Item>

        <div style={{ display: "flex", gap: 12 }}>
          <Form.Item label="Pickup Start Time" name="start" rules={[{ required: true, message: "Select start time" }]} style={{ flex: 1 }}>
            <TimePicker use12Hours format="h:mm A" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Pickup End Time" name="end" rules={[{ required: true, message: "Select end time" }]} style={{ flex: 1 }}>
            <TimePicker use12Hours format="h:mm A" style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <Form.Item label="Dietary Restrictions" name="dietary">
          <Checkbox.Group options={dietary} />
        </Form.Item>

        <Form.Item label="Available Food Items">
          <div style={{ display: "flex", gap: 8 }}>
            <Form.Item label="Item" style={{ marginBottom: 0, flex: 1 }}>
              <Input value={foodName} onChange={(e) => setFoodName(e.target.value)} placeholder="Food name" />
            </Form.Item>
            <Form.Item label="Quantity" style={{ marginBottom: 0, width: 80 }}>
              <Input type="number" min={1} value={foodQty} onChange={(e) => setFoodQty(Number(e.target.value) || 1)} />
            </Form.Item>
            <Button type="primary" onClick={addFood} style={{ backgroundColor: "#CC0000", borderColor: "#CC0000" }}>Add</Button>
          </div>
          <List dataSource={foodItems} renderItem={(f) => (
            <List.Item actions={[<Button type="link" danger onClick={() => removeFood(f.id)} key="remove">Remove</Button>]} key={f.id}>
              {f.name} (Qty: {f.qty})
            </List.Item>
          )} style={{ marginTop: 8 }} />
        </Form.Item>

        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={submitting} style={{ backgroundColor: "#CC0000", borderColor: "#CC0000" }}>
            Create Event
          </Button>
        </div>
      </Form>
    </Modal>
  );
}