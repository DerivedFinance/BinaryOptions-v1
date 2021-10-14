import React from 'react';
import { Modal } from 'react-bootstrap';

const TGEModal = ({ show, onClose, children }) => {
  return (
    <Modal
      className='modal fade err highvibe-modal'
      id=""
      show={show}
      onHide={onClose}
      backdrop='static'
      keyboard={false}
    >
      <Modal.Body>
        <div>{children}</div>
      </Modal.Body>
    </Modal>
  );
};

export default TGEModal;
