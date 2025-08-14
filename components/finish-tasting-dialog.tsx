"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface FinishTastingDialogProps {
  charuto: any
  isOpen: boolean
  onClose: () => void
  onFinish: (finishData: any) => void
}

export function FinishTastingDialog({ charuto, isOpen, onClose, onFinish }: FinishTastingDialogProps) {
  const [sabores, setSabores] = useState<string[]>([])
  const [avaliacao, setAvaliacao] = useState<number>(5)
  const [duracaoFumo, setDuracaoFumo] = useState<number>(0)
  const [comprariaNovamente, setComprariaNovamente] = useState<string>("")
  const [observacoes, setObservacoes] = useState("")
  const [fotoAnilha, setFotoAnilha] = useState<string>("")

  const saboresDisponiveis = [
    "Tabaco",
    "Madeira",
    "Café",
    "Chocolate",
    "Frutas",
    "Flores",
    "Castanha",
    "Terroso",
    "Pimenta",
  ]

  const toggleSabor = (sabor: string) => {
    setSabores((prev) => (prev.includes(sabor) ? prev.filter((s) => s !== sabor) : [...prev, sabor]))
  }

  const handleFinish = () => {
    if (!avaliacao || !duracaoFumo || !comprariaNovamente) {
      alert("Preencha todos os campos obrigatórios!")
      return
    }

    const finishData = {
      sabores,
      avaliacao,
      duracaoFumo,
      comprariaNovamente,
      observacoes,
      fotoAnilha,
      dataFim: new Date().toISOString(),
    }

    onFinish(finishData)

    // Reset form
    setSabores([])
    setAvaliacao(5)
    setDuracaoFumo(0)
    setComprariaNovamente("")
    setObservacoes("")
    setFotoAnilha("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Finalizar Degustação</DialogTitle>
          <DialogDescription>Como foi sua experiência com {charuto?.nome}?</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sabores */}
          <div>
            <Label className="text-base font-medium">Sabores Identificados</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {saboresDisponiveis.map((sabor) => (
                <div key={sabor} className="flex items-center space-x-2">
                  <Checkbox id={sabor} checked={sabores.includes(sabor)} onCheckedChange={() => toggleSabor(sabor)} />
                  <Label htmlFor={sabor} className="text-sm">
                    {sabor}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Avaliação */}
          <div>
            <Label htmlFor="avaliacao">Avaliação (0-10) *</Label>
            <Select value={avaliacao.toString()} onValueChange={(value) => setAvaliacao(Number.parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} -{" "}
                    {num <= 3 ? "Ruim" : num <= 5 ? "Regular" : num <= 7 ? "Bom" : num <= 9 ? "Muito Bom" : "Excelente"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duração */}
          <div>
            <Label htmlFor="duracao">Duração do Fumo (minutos) *</Label>
            <Input
              id="duracao"
              type="number"
              min="0"
              value={duracaoFumo}
              onChange={(e) => setDuracaoFumo(Number.parseInt(e.target.value) || 0)}
            />
          </div>

          {/* Compraria Novamente */}
          <div>
            <Label className="text-base font-medium">Compraria Novamente? *</Label>
            <RadioGroup value={comprariaNovamente} onValueChange={setComprariaNovamente} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="sim" />
                <Label htmlFor="sim">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="nao" />
                <Label htmlFor="nao">Não</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="depende" id="depende" />
                <Label htmlFor="depende">Depende do Preço</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Descreva sua experiência detalhadamente..."
              rows={3}
            />
          </div>

          {/* Foto da Anilha */}
          <div>
            <Label htmlFor="foto-anilha">Foto da Anilha</Label>
            <Input
              id="foto-anilha"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    setFotoAnilha(e.target?.result as string)
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleFinish} className="bg-orange-500 hover:bg-orange-600">
            Finalizar Degustação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
