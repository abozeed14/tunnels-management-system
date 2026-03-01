import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateFan, CreateFanSchema, Fan, FanDirection } from "@/types/api";
import { useCreateFan, useUpdateFan } from "@/hooks/use-tunnels";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface FanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tunnelId: number;
  fan?: Fan;
}

export function FanForm({ open, onOpenChange, tunnelId, fan }: FanFormProps) {
  const isEditing = !!fan;
  const createFan = useCreateFan();
  const updateFan = useUpdateFan();

  const form = useForm<CreateFan>({
    resolver: zodResolver(CreateFanSchema),
    defaultValues: {
      name: "",
      tunnelId: tunnelId,
      position: undefined,
      direction: FanDirection.Stopped,
      speed: 0,
      availableSpeeds: "0,25,50,100",
    },
  });

  // Reset form when opening/closing or changing fan
  useEffect(() => {
    if (open) {
      if (fan) {
        form.reset({
          name: fan.name,
          tunnelId: fan.tunnelId,
          position: fan.position || undefined,
          direction: fan.direction,
          speed: fan.speed,
          availableSpeeds: fan.availableSpeeds || "0,25,50,100",
        });
      } else {
        form.reset({
          name: "",
          tunnelId: tunnelId,
          position: undefined,
          direction: FanDirection.Stopped,
          speed: 0,
          availableSpeeds: "0,25,50,100",
        });
      }
    }
  }, [open, fan, tunnelId, form]);

  const onSubmit = async (data: CreateFan) => {
    try {
      if (isEditing && fan) {
        await updateFan.mutateAsync({ id: fan.id, data });
      } else {
        await createFan.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation hooks (toast)
      console.error("Form submission error:", error);
    }
  };

  const isLoading = createFan.isPending || updateFan.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Fan" : "Add Fan"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the fan configuration details."
              : "Add a new ventilation fan to the tunnel."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Fan 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position (m)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Distance from tunnel entrance
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="direction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Direction</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select direction" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={String(FanDirection.Forward)}>
                          Forward
                        </SelectItem>
                        <SelectItem value={String(FanDirection.Backward)}>
                          Backward
                        </SelectItem>
                        <SelectItem value={String(FanDirection.Stopped)}>
                          Stopped
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="speed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Speed (RPM)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : 0
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="availableSpeeds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Speeds</FormLabel>
                  <FormControl>
                    <Input placeholder="0,25,50,100" {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of supported speeds (e.g., 0,25,50,100)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isEditing ? "Update Fan" : "Create Fan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
