import React, { useState } from 'react';
import { Divider, Table, Button, Form, Input, message, Modal } from 'antd';
import axios from 'axios';

const UserDashboard = () => {
  const [availability, setAvailability] = useState([]);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [trainId, setTrainId] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Function to format the train name
  const formatTrainName = (train) => {
    return `${train.from_location} -> ${train.to_location} Express`;
  };

  const checkAvailability = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/seats/availability`, {
        params: { source, destination },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const formattedAvailability = response.data.map(train => ({
        ...train,
        name: formatTrainName(train)  // Add formatted train name
      }));

      setAvailability(formattedAvailability);
    } catch (error) {
      message.error('Error fetching availability');
    }
  };

  const bookSeat = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/seats/book`, 
      { route_id: trainId, number_of_tickets: numberOfTickets },  
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setModalMessage(`Seat booked successfully. Your Booking ID is: ${response.data.bookingId}`);
      setIsModalVisible(true);
    } catch (error) {
      console.log(error);
      message.error('Error booking seat');
    }
  };

  const getBookingDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBookingDetails(response.data);
    } catch (error) {
      message.error('Error fetching booking details');
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  return (
    <div className='main'>
      <Divider style={{ 
            borderTop: '4px', 
            }}orientation="center"><h1 className='titles'>User Dashboard</h1></Divider>
      <Form layout="inline">
        <Form.Item>
          <Input placeholder="Source" onChange={(e) => setSource(e.target.value)} />
        </Form.Item>
        <Form.Item>
          <Input placeholder="Destination" onChange={(e) => setDestination(e.target.value)} />
        </Form.Item>
        <Form.Item>
          <Button onClick={checkAvailability}>Check Availability</Button>
        </Form.Item>
      </Form>
      <Divider style={{ 
            borderTop: '4px', 
            }}orientation="center"><h1 className='titles'>Available trains</h1></Divider>
      
      <Table
      style={{ width: '80%', margin: '0 auto', paddingRight: '2%' }}
        dataSource={availability}
        columns={[
          { title: 'Train Name', dataIndex: 'name', key: 'name' }, 
          { title: 'Available Seats', dataIndex: 'available_seats', key: 'available_seats' },
          { title: 'Actions', key: 'actions', render: (text, record) => (
            <>
              <Input
                type="number"
                placeholder="Number of Tickets"
                min={1}
                defaultValue={1}
                onChange={(e) => setNumberOfTickets(e.target.value)}
              />
              <Button onClick={() => {
                setTrainId(record.id);
                bookSeat();
              }}>Book Seat</Button>
            </>
          ) }
        ]}
        rowKey="id"
      />
      <Divider style={{ 
            borderTop: '4px', 
            }}orientation="center"><h1 className='titles'>Check Bookings</h1></Divider>
      <h4> use Booking ID</h4>
      <Form layout="inline">
        <Form.Item>
          <Input placeholder="Booking ID" onChange={(e) => setBookingId(e.target.value)} />
        </Form.Item>
        <Form.Item>
          <Button onClick={getBookingDetails}>Get Booking Details</Button>
        </Form.Item>
      </Form>
      
      {bookingDetails && (
        <div>
          <h2>Booking Details</h2>
          <p>Train: {bookingDetails.from_location} to {bookingDetails.to_location}</p>
          <p>Number of Tickets: {bookingDetails.number_of_tickets}</p>
          <p>Booked By: {bookingDetails.username}</p>
        </div>
      )}

      <Modal title="Booking Successful" visible={isModalVisible} onOk={handleOk}>
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default UserDashboard;
