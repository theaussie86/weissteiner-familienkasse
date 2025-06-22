"use client";

import Modal from "@/components/Modal";
import { NewTransactionForm } from "./NewTransactionForm";
import React from "react";

interface NewTransactionModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
