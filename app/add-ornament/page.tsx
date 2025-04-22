"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { z } from "zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { QrCode } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { addOrnament } from "@/lib/api";
import { QRCodeSVG } from "qrcode.react";
import { fetchMerchants, addMerchant } from "@/lib/api";
import { useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  type: z.string({
    required_error: "Please select an ornament type.",
  }),
  weight: z.coerce.number().positive({
    message: "Weight must be a positive number.",
  }),
  costPrice: z.coerce.number().positive({
    message: "Cost price must be a positive number.",
  }),
  merchantCode: z.string().min(2, {
    message: "Merchant code must be at least 2 characters.",
  }),
  purity: z.string({
    required_error: "Please select purity.",
  }),
});
export type OrnamentFormData = z.infer<typeof formSchema>;

export default function AddOrnamentPage() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("manual");
  const [merchants, setMerchants] = useState<any[]>([]);
  const [showAddMerchantDialog, setShowAddMerchantDialog] = useState(false);
  const [newMerchant, setNewMerchant] = useState({
    name: "",
    merchantCode: "",
    phone: "",
  });
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      weight: undefined,
      costPrice: undefined,
      merchantCode: "",
      purity: "",
    },
  });

  useEffect(() => {
    const loadMerchants = async () => {
      try {
        const data = await fetchMerchants();
        setMerchants(data);
      } catch (error) {
        console.error("Failed to load merchants:", error);
        toast({
          title: "Error loading merchants",
          description: "Failed to load merchant list. Please try again.",
          variant: "destructive",
        });
      }
    };

    loadMerchants();
  }, [toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await addOrnament(values);
      const qrData = JSON.stringify({
        ornamentId: response.ornamentId,
        type: values.type,
        merchantCode: values.merchantCode,
        weight: values.weight,
        purity: values.purity,
      });
      if (response.success) {
        toast({
          title: "✅ Ornament added",
          description: `ID ${response.ornamentId} saved to DB.`,
        });
        // Generate QR code with ornament data
        setQrCode(qrData);
      } else {
        toast({
          title: "Error adding ornament",
          description: response.error || "An unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error adding ornament",
        description:
          "There was a problem adding the ornament. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleAddMerchant = async () => {
    try {
      if (
        !newMerchant.name ||
        !newMerchant.merchantCode ||
        !newMerchant.phone
      ) {
        toast({
          title: "Missing information",
          description: "Name, merchant code, and phone are required",
          variant: "destructive",
        });
        return;
      }

      // Check if merchant code already exists in local dropdown
      if (
        merchants.some(
          (m) =>
            m.merchantCode.toLowerCase() ===
            newMerchant.merchantCode.toLowerCase()
        )
      ) {
        toast({
          title: "Merchant code already exists",
          description: "Please use a different merchant code",
          variant: "destructive",
        });
        return;
      }

      // 📨 Send to backend
      const response = await addMerchant(newMerchant); // make sure you imported this

      toast({
        title: "Merchant added successfully",
        description: `${response.name} was added to the merchant list`,
      });

      // 🆕 Add to dropdown & select it
      setMerchants((prev) => [...prev, response]);
      form.setValue("merchantCode", response.merchantCode);

      // Reset form & close input
      setNewMerchant({ name: "", merchantCode: "", phone: "" });
      setShowAddMerchantDialog(false);
    } catch (error: any) {
      console.error("Add merchant error:", error);
      toast({
        title: "Error adding merchant",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  // const handleAddMerchant = async () => {
  //   try {
  //     if (!newMerchant.name || !newMerchant.merchantCode) {
  //       toast({
  //         title: "Missing information",
  //         description: "Name and merchant code are required",
  //         variant: "destructive",
  //       });
  //       return;
  //     }

  //     // Check if merchant code already exists
  //     if (
  //       merchants.some(
  //         (m) =>
  //           m.merchantCode.toLowerCase() ===
  //           newMerchant.merchantCode.toLowerCase()
  //       )
  //     ) {
  //       toast({
  //         title: "Merchant code already exists",
  //         description: "Please use a different merchant code",
  //         variant: "destructive",
  //       });
  //       return;
  //     }

  //     const response = await addMerchant(newMerchant);

  //     if (response.success) {
  //       toast({
  //         title: "Merchant added",
  //         description: "The merchant has been added successfully",
  //       });

  //       // Add the new merchant to the list
  //       const newMerchantWithId = {
  //         id: response.merchantId,
  //         ...newMerchant,
  //       };
  //       setMerchants([...merchants, newMerchantWithId]);

  //       // Set the merchant code in the form
  //       form.setValue("merchantCode", newMerchant.merchantCode);

  //       // Reset form and close dialog
  //       setNewMerchant({ name: "", merchantCode: "", phone: "" });
  //       setShowAddMerchantDialog(false);
  //     } else {
  //       toast({
  //         title: "Error adding merchant",
  //         description: response.error || "An unknown error occurred",
  //         variant: "destructive",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error adding merchant:", error);
  //     toast({
  //       title: "Error adding merchant",
  //       description:
  //         "There was a problem adding the merchant. Please try again.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Add New Ornament
      </h1>

      <Tabs defaultValue="manual" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ornament Details</CardTitle>
                <CardDescription>
                  Enter the details of the new ornament to add to inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select ornament type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ring">Ring</SelectItem>
                              <SelectItem value="necklace">Necklace</SelectItem>
                              <SelectItem value="earring">Earring</SelectItem>
                              <SelectItem value="bracelet">Bracelet</SelectItem>
                              <SelectItem value="pendant">Pendant</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (grams)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="costPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost Price (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="merchantCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Merchant Code</FormLabel>
                          <FormControl>
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between font-normal"
                                  >
                                    {field.value
                                      ? merchants.find(
                                          (merchant) =>
                                            merchant.merchantCode ===
                                            field.value
                                        )?.name || field.value
                                      : "Select merchant"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-0">
                                <Command>
                                  <CommandInput placeholder="Search merchants..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      No merchant found.
                                    </CommandEmpty>
                                    <CommandGroup heading="Existing Merchants">
                                      {merchants.map((merchant) => (
                                        <CommandItem
                                          key={merchant.id}
                                          value={merchant.merchantCode}
                                          onSelect={() => {
                                            form.setValue(
                                              "merchantCode",
                                              merchant.merchantCode
                                            );
                                            setOpen(false);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value ===
                                                merchant.merchantCode
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {merchant.name} (
                                          {merchant.merchantCode})
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                    <CommandSeparator />
                                    <CommandGroup>
                                      <CommandItem
                                        onSelect={() => {
                                          setShowAddMerchantDialog(true);
                                          setOpen(false);
                                        }}
                                      >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add New Merchant
                                      </CommandItem>
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormDescription>
                            Select a merchant or add a new one
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="purity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purity</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gold purity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="18K">18K</SelectItem>
                              <SelectItem value="22K">22K</SelectItem>
                              <SelectItem value="24K">24K</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      Add Ornament & Generate QR
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
                <CardDescription>
                  The generated QR code for the ornament
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
                {qrCode ? (
                  <div className="text-center">
                    <div className="mx-auto mb-4 border p-2 rounded-md">
                      <QRCodeSVG value={qrCode} size={200} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Scan this QR code to access ornament details
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <QrCode className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>Fill and submit the form to generate a QR code</p>
                  </div>
                )}
              </CardContent>
              {qrCode && (
                <CardFooter className="flex justify-center">
                  <Button variant="outline" onClick={() => window.print()}>
                    Print QR Code
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Add Merchant Dialog */}
        <Dialog
          open={showAddMerchantDialog}
          onOpenChange={setShowAddMerchantDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Merchant</DialogTitle>
              <DialogDescription>
                Enter merchant details to add them to your system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="merchant-name">Name *</Label>
                <Input
                  id="merchant-name"
                  value={newMerchant.name}
                  onChange={(e) =>
                    setNewMerchant({ ...newMerchant, name: e.target.value })
                  }
                  placeholder="Enter merchant name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="merchant-code">Merchant Code *</Label>
                <Input
                  id="merchant-code"
                  value={newMerchant.merchantCode}
                  onChange={(e) =>
                    setNewMerchant({
                      ...newMerchant,
                      merchantCode: e.target.value,
                    })
                  }
                  placeholder="Enter unique merchant code (e.g., MER001)"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="merchant-phone">Phone Number</Label>
                <Input
                  id="merchant-phone"
                  value={newMerchant.phone}
                  onChange={(e) =>
                    setNewMerchant({ ...newMerchant, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAddMerchantDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddMerchant}>Add Merchant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Upload</CardTitle>
              <CardDescription>
                Upload multiple ornaments at once using a CSV file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <div className="mx-auto flex flex-col items-center justify-center gap-1">
                    <div className="text-muted-foreground">
                      <p className="mb-2">
                        Drag and drop your CSV file here, or click to browse
                      </p>
                      <Input
                        type="file"
                        className="max-w-sm mx-auto"
                        accept=".csv"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Template</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Download our CSV template to ensure your data is formatted
                    correctly
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Download Template
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Upload and Process</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
