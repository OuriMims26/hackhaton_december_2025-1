"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Plus, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function AddCompanyModal() {
    const router = useRouter()
    const { toast } = useToast()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [website, setWebsite] = useState("")

    const handleSubmit = async () => {
        if (!name) return

        setLoading(true)
        try {
            const { error } = await supabase
                .from('companies')
                .insert([
                    {
                        name,
                        website_url: website
                    }
                ])

            if (error) throw error

            setOpen(false)
            setName("")
            setWebsite("")
            router.refresh()
            toast({
                title: "Success",
                description: "Company added successfully",
            })
        } catch (error) {
            console.error('Error adding company:', error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to add company",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#F1C086] to-[#F6B88C] text-[#0E0E10] hover:opacity-90 transition-opacity">
                    <Plus className="w-4 h-4 mr-2" /> Add Company
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#1A1A1A] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Add New Company</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Track a new company in your portfolio.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Acme Inc."
                            className="col-span-3 bg-[#050814] border-white/10"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="website" className="text-right">
                            Website
                        </Label>
                        <Input
                            id="website"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://..."
                            className="col-span-3 bg-[#050814] border-white/10"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading || !name}
                        className="bg-[#F1C086] text-black hover:bg-[#F6B88C]"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Company
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
