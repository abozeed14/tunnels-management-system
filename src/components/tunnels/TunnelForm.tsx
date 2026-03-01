import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTunnel, CreateTunnelSchema, Tunnel } from "@/types/api";
import { useCreateTunnel, useUpdateTunnel } from "@/hooks/use-tunnels";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface TunnelFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tunnel?: Tunnel;
}

export function TunnelForm({ open, onOpenChange, tunnel }: TunnelFormProps) {
  const isEditing = !!tunnel;
  const createTunnel = useCreateTunnel();
  const updateTunnel = useUpdateTunnel();

  const form = useForm<CreateTunnel>({
    resolver: zodResolver(CreateTunnelSchema),
    defaultValues: {
      name: "",
      code: "",
      location: "",
      length: undefined,
      voltageMin: undefined,
      voltageMax: undefined,
      currentMax: undefined,
    },
  });

  // Reset form when opening/closing or changing tunnel
  useEffect(() => {
    if (open) {
      if (tunnel) {
        form.reset({
          name: tunnel.name,
          code: tunnel.code,
          location: tunnel.location || "",
          length: tunnel.length || undefined,
          voltageMin: tunnel.voltageMin || undefined,
          voltageMax: tunnel.voltageMax || undefined,
          currentMax: tunnel.currentMax || undefined,
        });
      } else {
        form.reset({
          name: "",
          code: "",
          location: "",
          length: undefined,
          voltageMin: undefined,
          voltageMax: undefined,
          currentMax: undefined,
        });
      }
    }
  }, [open, tunnel, form]);

  const onSubmit = async (data: CreateTunnel) => {
    try {
      if (isEditing && tunnel) {
        await updateTunnel.mutateAsync({ id: tunnel.id, data });
      } else {
        await createTunnel.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation hooks (toast)
      console.error("Form submission error:", error);
    }
  };

  const isLoading = createTunnel.isPending || updateTunnel.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Tunnel" : "Create Tunnel"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the tunnel configuration details."
              : "Add a new tunnel to the system."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Central Tunnel A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="TUN-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Downtown District" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length (m)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1500"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Current (A)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1000"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="voltageMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Voltage (V)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="220"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="voltageMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Voltage (V)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="240"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update Tunnel" : "Create Tunnel"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
