"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface FinishTastingModalProps {
  isOpen: boolean
  onClose: () => void
  onFinish: () => void
  activeTasting: any
}

const sabores = ["Tabaco", "Pimenta", "Terroso", "Flores", "Café", "Frutas", "Chocolate", "Castanhas", "Madeira"]

export function FinishTastingModal({ isOpen, onClose, onFinish, activeTasting }: FinishTastingModalProps) {
  const [formData, setFormData] = useState({
    duracao: "",
    notas: "",
    construcaoQueima: "",
    comprarNovamente: "",
    saboresSelecionados: [] as string[],
    observacoes: "",
    foto: null as File | null,
  })

  const getDuration = () => {
    if (!activeTasting) return "0"
    return Math.floor((Date.now() - activeTasting.startTime.getTime()) / (1000 * 60)).toString()
  }

  const handleSaborChange = (sabor: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      saboresSelecionados: checked
        ? [...prev.saboresSelecionados, sabor]
        : prev.saboresSelecionados.filter((s) => s !== sabor),
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, foto: file }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Finalizando degustação:", formData)
    onFinish()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Finalizar Degustação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Degustação em andamento:</p>
            <p className="font-medium">{getDuration()}h</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Duração (minutos)</Label>
              <Input
                type="number"
                value={formData.duracao || getDuration()}
                onChange={(e) => setFormData((prev) => ({ ...prev, duracao: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Notas (1-10)</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={formData.notas}
                onChange={(e) => setFormData((prev) => ({ ...prev, notas: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Construção e Queima (observações)</Label>
            <Textarea
              placeholder="Descreva a construção e queima do charuto..."
              value={formData.construcaoQueima}
              onChange={(e) => setFormData((prev) => ({ ...prev, construcaoQueima: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Compraria Novamente?</Label>
            <Select
              value={formData.comprarNovamente}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, comprarNovamente: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
                <SelectItem value="talvez">Talvez</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Roda de Sabores</Label>
            <div className="grid grid-cols-3 gap-2">
              {sabores.map((sabor) => (
                <div key={sabor} className="flex items-center space-x-2">
                  <Checkbox
                    id={sabor}
                    checked={formData.saboresSelecionados.includes(sabor)}
                    onCheckedChange={(checked) => handleSaborChange(sabor, checked as boolean)}
                  />
                  <Label htmlFor={sabor} className="text-sm">
                    {sabor}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Observações</Label>
            <Textarea
              placeholder="Suas impressões gerais sobre o charuto..."
              value={formData.observacoes}
              onChange={(e) => setFormData((prev) => ({ ...prev, observacoes: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Foto do Avulso</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="foto-avulso" />
              <label htmlFor="foto-avulso" className="cursor-pointer">
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
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6">
              Finalizar Degustação
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
