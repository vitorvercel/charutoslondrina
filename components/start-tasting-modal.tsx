"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface StartTastingModalProps {
  isOpen: boolean
  onClose: () => void
  onStart: (data: any) => void
}

const mockCharutos = [
  { id: 1, name: "Cohiba Robusto" },
  { id: 2, name: "Montecristo No. 2" },
  { id: 3, name: "Romeo y Julieta Churchill" },
]

export function StartTastingModal({ isOpen, onClose, onStart }: StartTastingModalProps) {
  const [formData, setFormData] = useState({
    charuto: "",
    momento: "",
    tipoCorte: "",
    fluxo: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.charuto && formData.momento && formData.tipoCorte && formData.fluxo) {
      onStart(formData)
      setFormData({ charuto: "", momento: "", tipoCorte: "", fluxo: "" })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Iniciar Degustação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Charuto <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.charuto}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, charuto: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um charuto" />
              </SelectTrigger>
              <SelectContent>
                {mockCharutos.map((charuto) => (
                  <SelectItem key={charuto.id} value={charuto.name}>
                    {charuto.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Momento</Label>
            <Select
              value={formData.momento}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, momento: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sozinho">Sozinho</SelectItem>
                <SelectItem value="confraternizando">Confraternizando</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Tipo de Corte</Label>
            <Select
              value={formData.tipoCorte}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, tipoCorte: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reto">Reto</SelectItem>
                <SelectItem value="v">V</SelectItem>
                <SelectItem value="furado">Furado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Fluxo</Label>
            <Select
              value={formData.fluxo}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, fluxo: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solto">Solto</SelectItem>
                <SelectItem value="medio">Médio</SelectItem>
                <SelectItem value="preso">Preso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="px-6 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6">
              Iniciar Degustação
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
