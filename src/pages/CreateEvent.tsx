"use client";
import { useState } from "react";
import { Modal, Form, Input, Button, Checkbox, List, message, TimePicker, } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { supabase } from "../lib/supabaseClient";

export default function CreateEventModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form] = Form.useForm();
  const [foodItems, setFoodItems] = useState<
    { id: string; name: string; qty: number }[]
  >([]);
  const [foodName, setFoodName] = useState("");
  const [foodQty, setFoodQty] = useState(1);

  const dietary = ["Vegan", "Gluten Free", "Vegetarian", "Halal", "Kosher"];
  const campuses = ["West", "Central", "East", "South", "Fenway", "Medical"];

  const addFood = () => {
    if (!foodName.trim()) return;
    setFoodItems([
      ...foodItems,
      { id: Date.now().toString(), name: foodName, qty: foodQty },
    ]);
    setFoodName("");
    setFoodQty(1);
  };

  const removeFood = (id: string) =>
    setFoodItems(foodItems.filter((f) => f.id !== id));

  const handleSubmit = async (values: any) => {
    const newEvent = {
      title: values.title,
      location: values.location,
      start_time: values.start.format("HH:mm"),
      end_time: values.end.format("HH:mm"),
      dietary: values.dietary || [],
      campus: values.campus || [],
      food_items: foodItems,
      created_at: new Date(),
    };

    const { error } = await supabase.from("events").insert([newEvent]);

    if (error) {
      console.error(error);
      message.error("Error creating event");
    } else {
      message.success("Event created!");
      form.resetFields();
      setFoodItems([]);
      onClose(); // close modal after successful creation
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Create Event"
      centered
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Event Title"
          name="title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please enter a location" }]}
        >
          <Input />
        </Form.Item>

        <div style={{ display: "flex", gap: 12 }}>
          <Form.Item
            label="Start Time"
            name="start"
            rules={[{ required: true, message: "Select start time" }]}
            style={{ flex: 1 }}
          >
            <TimePicker use12Hours format="h:mm A" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="End Time"
            name="end"
            rules={[{ required: true, message: "Select end time" }]}
            style={{ flex: 1 }}
          >
            <TimePicker use12Hours format="h:mm A" style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <Form.Item label="Dietary Restrictions" name="dietary">
          <Checkbox.Group options={dietary} />
        </Form.Item>

        <Form.Item label="Campus Locations" name="campus">
          <Checkbox.Group options={campuses.map((c) => `${c} Campus`)} />
        </Form.Item>

        <Form.Item label="Available Food Items">
          <div style={{ display: "flex", gap: 8 }}>
            <Input
              placeholder="Food name"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              onPressEnter={addFood}
            />
            <Input
              type="number"
              min={1}
              value={foodQty}
              onChange={(e) => setFoodQty(parseInt(e.target.value) || 1)}
              style={{ width: 70 }}
            />
            <Button icon={<PlusOutlined />} onClick={addFood} />
          </div>
          <List
            dataSource={foodItems}
            renderItem={(f) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    danger
                    onClick={() => removeFood(f.id)}
                    key="remove"
                  >
                    remove
                  </Button>,
                ]}
                key={f.id}
              >
                {f.name} (Qty: {f.qty})
              </List.Item>
            )}
            style={{ marginTop: 8 }}
          />
        </Form.Item>

        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Create Event
          </Button>
        </div>
      </Form>
    </Modal>
  );
}