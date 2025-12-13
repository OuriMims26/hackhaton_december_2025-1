"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

export function AddCompanyModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#F1C086] to-[#F6B88C] text-[#0E0E10] hover:opacity-90 transition-opacity">
                    <Plus className="w-4 h-4 mr-2" /> Add Startup
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#1A1A1A] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Add New Startup</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Track a new company in your portfolio.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" placeholder="Acme Inc." className="col-span-3 bg-[#050814] border-white/10" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="website" className="text-right">
                            Website
                        </Label>
                        <Input id="website" placeholder="https://..." className="col-span-3 bg-[#050814] border-white/10" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="industry" className="text-right">
                            Industry
                        </Label>
                        <Input id="industry" placeholder="Fintech" className="col-span-3 bg-[#050814] border-white/10" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" className="bg-[#F1C086] text-black hover:bg-[#F6B88C]">Save Company</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
