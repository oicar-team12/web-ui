import React, { useState, ChangeEvent } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axiosInstance from '../../services/axiosConfig';
import { shouldUseMock, simulateApiDelay } from '../../config';

interface DeleteAccountModalProps {
  show: boolean;
  onHide: () => void;
  onDelete: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ show, onHide, onDelete }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!password) {
      setError('Please enter your password to confirm deletion');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (shouldUseMock()) {
        await simulateApiDelay();
        onDelete();
        onHide();
        return;
      }

      await axiosInstance.post('/user/delete-account', { password });
      onDelete();
      onHide();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
        <Form>
          <Form.Group>
            <Form.Label>Enter your password to confirm</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </Form.Group>
          {error && <div className="text-danger mt-2">{error}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? 'Deleting...' : 'Delete Account'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteAccountModal;
