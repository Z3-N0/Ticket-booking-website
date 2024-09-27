import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';
import "../App.css";

const adminApiKey = process.env.REACT_APP_ADMIN_API_KEY;
const { Option } = Select;

const AdminDashboard = () => {
  const [locations, setLocations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [isRouteModalVisible, setIsRouteModalVisible] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [editingRoute, setEditingRoute] = useState(null);

  useEffect(() => {
    fetchLocations();
    fetchRoutes();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/locations');
      setLocations(response.data[0]);
    } catch (error) {
      message.error('Error fetching locations');
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/routes');
      setRoutes(response.data[0]);
    } catch (error) {
      message.error('Error fetching routes');
    }
  };

  const handleAddLocation = async (values) => {
    try {
      await axios.post('http://localhost:5000/api/locations/add', values, {
        headers: { 'x-api-key': adminApiKey }
      });
      message.success('Location added successfully');
      fetchLocations();
      setIsLocationModalVisible(false);
    } catch (error) {
      message.error('Error adding location');
    }
  };

  const handleEditLocation = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/locations/edit/${editingLocation.id}`, values, {
        headers: { 'x-api-key': adminApiKey }
      });
      message.success('Location updated successfully');
      fetchLocations();
      setEditingLocation(null);
      setIsLocationModalVisible(false);
    } catch (error) {
      message.error('Error updating location');
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/locations/delete/${id}`, {
        headers: { 'x-api-key': adminApiKey }
      });
      message.success('Location deleted successfully');
      fetchLocations();
    } catch (error) {
      message.error('Error deleting location');
    }
  };

  const showEditLocationModal = (location) => {
    setEditingLocation(location);
    setIsLocationModalVisible(true);
  };

  const handleAddRoute = async (values) => {
    try {
      await axios.post('http://localhost:5000/api/routes/add', values, {
        headers: { 'x-api-key': adminApiKey }
      });
      message.success('Route added successfully');
      fetchRoutes();
      setIsRouteModalVisible(false);
    } catch (error) {
      message.error('Error adding route');
    }
  };

  const handleEditRoute = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/routes/edit/${editingRoute.id}`, values, {
        headers: { 'x-api-key': adminApiKey }
      });
      message.success('Route updated successfully');
      fetchRoutes();
      setEditingRoute(null);
      setIsRouteModalVisible(false);
    } catch (error) {
      message.error('Error updating route');
    }
  };

  const handleDeleteRoute = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/routes/delete/${id}`, {
        headers: { 'x-api-key': adminApiKey }
      });
      message.success('Route deleted successfully');
      fetchRoutes();
    } catch (error) {
      message.error('Error deleting route');
    }
  };

  const showEditRouteModal = (route) => {
    setEditingRoute(route);
    setIsRouteModalVisible(true);
  };

  return (
    <div className="main">
      <h3 className="title">Ticket Booking</h3>
      <h1 className="title">Admin Dashboard</h1>
      <div className="buttons">
        <Button type="primary" onClick={() => setIsLocationModalVisible(true)}>Add Location</Button>
        <Button type="primary" onClick={() => setIsRouteModalVisible(true)} style={{ marginLeft: 10 }}>Add Route</Button>
      </div>

      <h2>Locations</h2>
      <Table 
        style={{ width: '60%', margin: '0 auto' }}
        dataSource={locations}
        columns={[
          { title: 'Location Name', dataIndex: 'name', key: 'name' },
          { 
            title: 'Actions', 
            key: 'actions', 
            render: (text, record) => (
              <>
                <Button onClick={() => showEditLocationModal(record)}>Edit</Button>
                <Button onClick={() => handleDeleteLocation(record.id)} style={{ marginLeft: 10 }}>Delete</Button>
              </>
            ) 
          }
        ]}
        rowKey="id"
      />

      <h2>Routes</h2>
      <Table
        style={{ width: '80%', margin: '0 auto' }}
        dataSource={routes}
        columns={[
          { title: 'From Location', dataIndex: 'from_location', key: 'from_location' },
          { title: 'To Location', dataIndex: 'to_location', key: 'to_location' },
          { title: 'Seats', dataIndex: 'seats', key: 'seats' },
          { title: 'Departure Time', dataIndex: 'departure_time', key: 'departure_time' },
          { title: 'Arrival Time', dataIndex: 'arrival_time', key: 'arrival_time' },
          { 
            title: 'Actions', 
            key: 'actions', 
            render: (text, record) => (
              <>
                <Button onClick={() => showEditRouteModal(record)}>Edit</Button>
                <Button onClick={() => handleDeleteRoute(record.id)} style={{ marginLeft: 10 }}>Delete</Button>
              </>
            ) 
          }
        ]}
        rowKey="id"
      />

      <Modal
        title={editingLocation ? "Edit Location" : "Add Location"}
        visible={isLocationModalVisible}
        onCancel={() => {
          setIsLocationModalVisible(false);
          setEditingLocation(null);
        }}
        onOk={() => {
          const form = document.forms['locationForm'];
          const values = { name: form.elements['locationName'].value };
          editingLocation ? handleEditLocation(values) : handleAddLocation(values);
        }}
      >
        <Form name="locationForm">
          <Form.Item label="Location Name">
            <Input name="locationName" defaultValue={editingLocation ? editingLocation.name : ''} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingRoute ? "Edit Route" : "Add Route"}
        visible={isRouteModalVisible}
        onCancel={() => {
          setIsRouteModalVisible(false);
          setEditingRoute(null);
        }}
        footer={null} 
      >
        <Form
          name="routeForm"
          onFinish={(values) => {
            editingRoute ? handleEditRoute(values) : handleAddRoute(values);
            setIsRouteModalVisible(false); 
          }}
          initialValues={{
            fromLocation: editingRoute ? editingRoute.from_location : undefined,
            toLocation: editingRoute ? editingRoute.to_location : undefined,
            seats: editingRoute ? editingRoute.seats : undefined,
            departureTime: editingRoute ? editingRoute.departure_time : undefined,
            arrivalTime: editingRoute ? editingRoute.arrival_time : undefined,
          }}
        >
          <Form.Item label="From Location" name="fromLocation" rules={[{ required: true, message: 'Please select a from location' }]}>
            <Select>
              {locations.map((location) => (
                <Option key={location.name} value={location.name}>{location.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="To Location" name="toLocation" rules={[{ required: true, message: 'Please select a to location' }]}>
            <Select>
              {locations.map((location) => (
                <Option key={location.name} value={location.name}>{location.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Seats" name="seats" rules={[{ required: true, message: 'Please input the number of seats' }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Departure Time" name="departureTime" rules={[{ required: true, message: 'Please select a departure time' }]}>
            <Input type="time" />
          </Form.Item>

          <Form.Item label="Arrival Time" name="arrivalTime" rules={[{ required: true, message: 'Please select an arrival time' }]}>
            <Input type="time" />
          </Form.Item>

          <Button type="primary" htmlType="submit">{editingRoute ? 'Update Route' : 'Add Route'}</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
