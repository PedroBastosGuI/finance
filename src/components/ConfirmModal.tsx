'use client'

import { AlertTriangle, X, Loader2 } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
  loading = false
}: ConfirmModalProps) {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-destructive',
          confirmBtn: 'btn-destructive'
        }
      case 'warning':
        return {
          icon: 'text-yellow-500',
          confirmBtn: 'bg-yellow-500 hover:bg-yellow-600 text-white'
        }
      default:
        return {
          icon: 'text-primary',
          confirmBtn: 'btn-primary'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <AlertTriangle className={`h-5 w-5 ${styles.icon}`} />
            <h3 className="font-semibold">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-muted-foreground">{message}</p>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 btn btn-secondary py-2 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 btn ${styles.confirmBtn} py-2 disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Excluindo...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}