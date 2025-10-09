
import React, { useState } from 'react';
import SettingsModal from '../components/SettingsModal';

export default function SettingsScreen() {
  const [showModal, setShowModal] = useState(false);

  return (
    <SettingsModal
      visible={showModal}
      onClose={() => setTimeout(() => setShowModal(false), 300)}
    />
  );
}