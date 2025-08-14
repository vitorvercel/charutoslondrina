"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Charuto {
  id: string
  nome: string
  marca: string
  paisOrigem: string
  preco: number
  quantidade: number
  dataCompra: string
  foto?: string
}

interface TastingDialogProps {
  charuto: Charuto | null
  isOpen: boolean
  onClose: () => void
  onStartTasting: (tastingData: any) => void
}

export function TastingDialog({ charuto, isOpen, onClose, onStartTasting }: TastingDialogProps) {
  const [corte, setCorte] = useState<string>("")
  const [momento, setMomento] = useState<string>("")
  const [fluxo, setFluxo] = useState<string>("")

  const handleStartTasting = () => {
    if (!charuto || !corte || !momento || !fluxo) {
      alert("Preencha todos os campos!")
      return
    }

    const tastingData = {
      charuteId: charuto.id,
      nome: charuto.nome,
      marca: charuto.marca,
      paisOrigem: charuto.paisOrigem,
      corte,
      momento,
      fluxo,
      dataInicio: new Date().toISOString(),
      status: "em-degustacao",
    }

    onStartTasting(tastingData)

    // Reset form
    setCorte("")
    setMomento("")
    setFluxo("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Iniciar Degustação</DialogTitle>
          <DialogDescription>Configure os detalhes para degustar {charuto?.nome}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tipo de Corte */}
          <div>
            <Label className="text-base font-medium">Tipo de Corte</Label>
            <RadioGroup value={corte} onValueChange={setCorte} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reto" id="reto" />
                <Label htmlFor="reto">Reto</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="v" id="v" />
                <Label htmlFor="v">V</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="furado" id="furado" />
                <Label htmlFor="furado">Furado</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Momento */}
          <div>
            <Label className="text-base font-medium">Momento</Label>
            <RadioGroup value={momento} onValueChange={setMomento} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sozinho" id="sozinho" />
                <Label htmlFor="sozinho">Sozinho</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="confraternizando" id="confraternizando" />
                <Label htmlFor="confraternizando">Confraternizando</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Fluxo */}
          <div>
            <Label className="text-base font-medium">Fluxo</Label>
            <RadioGroup value={fluxo} onValueChange={setFluxo} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="solto" id="solto" />
                <Label htmlFor="solto">Solto</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medio" id="medio" />
                <Label htmlFor="medio">Médio</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="preso" id="preso" />
                <Label htmlFor="preso">Preso</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleStartTasting} className="bg-orange-500 hover:bg-orange-600">
            Iniciar Degustação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
