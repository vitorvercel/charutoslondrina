"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AddCigarModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddCigarModal({ isOpen, onClose }: AddCigarModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    bitola: "",
    pais: "",
    valorPago: "",
    dataAquisicao: "",
    quantidadeEstoque: "1",
    foto: null as File | null,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, foto: file }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Dados do charuto:", formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Adicionar Charuto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
              Nome <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange("nome", e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bitola" className="text-sm font-medium text-gray-700">
              Bitola
            </Label>
            <Input
              id="bitola"
              value={formData.bitola}
              onChange={(e) => handleInputChange("bitola", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pais" className="text-sm font-medium text-gray-700">
              País
            </Label>
            <Input
              id="pais"
              value={formData.pais}
              onChange={(e) => handleInputChange("pais", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorPago" className="text-sm font-medium text-gray-700">
              Valor Pago (R$)
            </Label>
            <Input
              id="valorPago"
              type="number"
              step="0.01"
              value={formData.valorPago}
              onChange={(e) => handleInputChange("valorPago", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataAquisicao" className="text-sm font-medium text-gray-700">
              Data de Aquisição
            </Label>
            <Input
              id="dataAquisicao"
              type="date"
              value={formData.dataAquisicao}
              onChange={(e) => handleInputChange("dataAquisicao", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantidadeEstoque" className="text-sm font-medium text-gray-700">
              Quantidade em Estoque
            </Label>
            <Input
              id="quantidadeEstoque"
              type="number"
              min="1"
              value={formData.quantidadeEstoque}
              onChange={(e) => handleInputChange("quantidadeEstoque", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Foto do Charuto</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="foto-upload" />
              <label htmlFor="foto-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Escolher arquivo ou arraste e solte</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
              </label>
              {formData.foto && (
                <p className="text-sm text-green-600 mt-2">Arquivo selecionado: {formData.foto.name}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="px-6 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6">
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
