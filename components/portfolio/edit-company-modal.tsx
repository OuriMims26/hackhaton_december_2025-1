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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface EditCompanyModalProps {
    company: {
        id: string
        name: string
        website_url: string // Made required to match type usage, though optional in card
    }
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdate: () => void // Callback to refresh parent data
}

export function EditCompanyModal({ company, open, onOpenChange, onUpdate }: EditCompanyModalProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [name, setName] = useState(company.name)
    const [website, setWebsite] = useState(company.website_url)

    const handleUpdate = async () => {
        if (!name) return

        setLoading(true)
        try {
            const { error } = await supabase
                .from('companies')
                .update({
                    name,
                    website_url: website,
                })
                .eq('id', company.id)

            if (error) throw error

            toast({
                title: "Success",
                description: "Company updated successfully",
            })
            onOpenChange(false)
            onUpdate()
        } catch (error) {
            console.error('Error updating company:', error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update company",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        setDeleting(true)
        try {
            const { error } = await supabase
                .from('companies')
                .delete()
                .eq('id', company.id)

            if (error) throw error

            toast({
                title: "Success",
                description: "Company deleted successfully",
            })
            router.push('/portfolio')
            router.refresh()
        } catch (error) {
            console.error('Error deleting company:', error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete company",
            })
            setDeleting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#1A1A1A] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Edit Company</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Update details or delete this company.
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
                            className="col-span-3 bg-[#050814] border-white/10"
                        />
                    </div>
                </div>
                <DialogFooter className="flex justify-between sm:justify-between">
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading || deleting}
                        className="bg-red-900/50 hover:bg-red-900 text-red-200"
                    >
                        {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                        Delete
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleUpdate}
                            disabled={loading || deleting || !name}
                            className="bg-[#F1C086] text-black hover:bg-[#F6B88C]"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
