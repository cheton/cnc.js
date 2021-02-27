import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
} from '@trendmicro/react-styled-ui';
import React from 'react';
import i18n from 'app/lib/i18n';

const ConfirmDeleteMacro = ({
  onClose,
  name,
  onConfirm,
}) => (
  <Modal
    closeOnEsc
    closeOnOutsideClick
    isCloseButtonVisible
    isOpen
    onClose={onClose}
    size="sm"
  >
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>
        {i18n._('Delete Macro')}
      </ModalHeader>
      <ModalBody>
        <Box mb="4x">
          {i18n._('Are you sure you want to delete this macro?')}
        </Box>
        <Text fontWeight="semibold">
          {name}
        </Text>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="default"
          onClick={onClose}
        >
          {i18n._('Cancel')}
        </Button>
        <Button
          variant="emphasis"
          onClick={onConfirm}
        >
          {i18n._('Delete')}
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default ConfirmDeleteMacro;