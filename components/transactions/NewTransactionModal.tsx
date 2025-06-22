"use client";

import Modal from "@/components/Modal";
import { NewTransactionForm } from "./NewTransactionForm";

interface NewTransactionModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

export function NewTransactionModal({
  isModalOpen,
  setIsModalOpen,
}: NewTransactionModalProps) {
  return (
    <Modal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      title="Neue Transaktion erstellen"
    >
      <NewTransactionForm setIsOpen={setIsModalOpen} />
    </Modal>
  );
}
