import { useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FanCard, LightCard, MeterCard } from "@/components/ui/equipment-cards";
import { GaugeChart, MetricDisplay } from "@/components/ui/gauge-chart";
import { StatusBadge } from "@/components/ui/status-badge";
import { ControlToggle, ControlToggleGroup } from "@/components/ui/control-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useTunnel, useFans, useLights, useElectricityMeter, useControlFan, useControlLight } from "@/hooks/use-tunnels";
import { FanDirection, Fan } from "@/types/api";
import { TunnelForm } from "@/components/tunnels/TunnelForm";
import { FanForm } from "@/components/fans/FanForm";
import {
  Route,
  Fan as FanIcon,
  Lightbulb,
  Zap,
  MapPin,
  Ruler,
  ArrowRight,
  ArrowLeft,
  Square,
  Power,
  Pencil,
  Plus,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Mock electricity history data
const mockHistoryData = Array.from({ length: 20 }, (_, i) => ({
  time: new Date(Date.now() - (19 - i) * 60000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  voltage: 225 + Math.random() * 10,
  current: 40 + Math.random() * 15,
  power: 9 + Math.random() * 3,
}));

export default function TunnelDetailPage() {
  const { tunnelId } = useParams<{ tunnelId: string }>();
  const id = Number(tunnelId);

  const { data: tunnel, isLoading: tunnelLoading } = useTunnel(id);
  const { data: fans, isLoading: fansLoading } = useFans(id);
  const { data: lights, isLoading: lightsLoading } = useLights(id);
  const { data: meter, isLoading: meterLoading } = useElectricityMeter(id);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFanCreateOpen, setIsFanCreateOpen] = useState(false);
  const [editingFan, setEditingFan] = useState<Fan | undefined>(undefined);

  const controlFan = useControlFan();
  const controlLight = useControlLight();

  if (tunnelLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64 lg:col-span-2" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!tunnel) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Route className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Tunnel Not Found</h2>
          <p className="text-muted-foreground">
            The requested tunnel could not be found.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Route className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">{tunnel.name}</h1>
              <span className="font-mono text-muted-foreground">
                {tunnel.code}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {tunnel.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {tunnel.location}
                </span>
              )}
              {tunnel.length && (
                <span className="flex items-center gap-1">
                  <Ruler className="h-4 w-4" />
                  {tunnel.length}m
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Tunnel
            </Button>
            <StatusBadge status="operational" pulse size="lg">
              System Normal
            </StatusBadge>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Electricity Meter */}
          <Card className="card-industrial lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-chart-voltage" />
                Power Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              {meterLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : meter ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <GaugeChart
                      value={meter.voltage}
                      min={tunnel.voltageMin || 200}
                      max={tunnel.voltageMax || 250}
                      label="Voltage"
                      unit="V"
                      thresholds={{
                        warning: (tunnel.voltageMax || 250) - 10,
                        critical: tunnel.voltageMax || 250,
                      }}
                    />
                    <GaugeChart
                      value={meter.current}
                      min={0}
                      max={tunnel.currentMax || 100}
                      label="Current"
                      unit="A"
                      thresholds={{
                        warning: (tunnel.currentMax || 100) * 0.8,
                        critical: tunnel.currentMax || 100,
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <MetricDisplay
                      label="Power"
                      value={meter.power}
                      unit="kW"
                      status="operational"
                    />
                    <MetricDisplay
                      label="Power Factor"
                      value={meter.powerFactor}
                      status={
                        meter.powerFactor >= (tunnel.powerFactorMin || 0.85)
                          ? "operational"
                          : "warning"
                      }
                    />
                  </div>
                  <MetricDisplay
                    label="Energy Consumption"
                    value={meter.energyConsumption.toFixed(1)}
                    unit="kWh"
                  />
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No meter data available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Electricity Chart */}
          <Card className="card-industrial lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-chart-voltage" />
                Power Trends (Last 20 min)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockHistoryData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--chart-grid))"
                    />
                    <XAxis
                      dataKey="time"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="hsl(var(--chart-voltage))"
                      fontSize={10}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="hsl(var(--chart-current))"
                      fontSize={10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="voltage"
                      stroke="hsl(var(--chart-voltage))"
                      strokeWidth={2}
                      dot={false}
                      name="Voltage (V)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="current"
                      stroke="hsl(var(--chart-current))"
                      strokeWidth={2}
                      dot={false}
                      name="Current (A)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fans Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FanIcon className="h-5 w-5 text-primary" />
              Ventilation Fans
              <span className="text-sm font-normal text-muted-foreground">
                ({fans?.length || 0} units)
              </span>
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingFan(undefined);
                setIsFanCreateOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Fan
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {fansLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="card-industrial">
                    <CardContent className="p-4">
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : fans?.length ? (
              fans.map((fan) => (
                <FanControlCard
                  key={fan.id}
                  fan={fan}
                  onControl={(command) =>
                    controlFan.mutate({
                      id: fan.id,
                      command,
                      tunnelId: id,
                    })
                  }
                  onEdit={() => {
                    setEditingFan(fan);
                    setIsFanCreateOpen(true);
                  }}
                  isControlling={controlFan.isPending}
                />
              ))
            ) : (
              <Card className="card-industrial col-span-full">
                <CardContent className="py-8 text-center text-muted-foreground">
                  No fans configured for this tunnel. Click "Add Fan" to create one.
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Lights Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-status-warning" />
            Lighting
            <span className="text-sm font-normal text-muted-foreground">
              ({lights?.length || 0} units)
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {lightsLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="card-industrial">
                    <CardContent className="p-4">
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : lights?.length ? (
              lights.map((light) => (
                <LightControlCard
                  key={light.id}
                  light={light}
                  onControl={(isOn) =>
                    controlLight.mutate({
                      id: light.id,
                      command: { isOn },
                      tunnelId: id,
                    })
                  }
                  isControlling={controlLight.isPending}
                />
              ))
            ) : (
              <Card className="card-industrial col-span-full">
                <CardContent className="py-8 text-center text-muted-foreground">
                  No lights configured for this tunnel
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
      
      {tunnel && (
        <TunnelForm
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          tunnel={tunnel}
        />
      )}

      <FanForm
        open={isFanCreateOpen}
        onOpenChange={setIsFanCreateOpen}
        tunnelId={id}
        fan={editingFan}
      />
    </DashboardLayout>
  );
}

// Fan control card with inline controls
interface FanControlCardProps {
  fan: any;
  onControl: (command: any) => void;
  onEdit: () => void;
  isControlling: boolean; 
}

function FanControlCard({ fan, onControl, onEdit, isControlling }: FanControlCardProps) {
  const speeds = fan.availableSpeeds
    ? fan.availableSpeeds.split(",").map(Number)
    : [0, 25,50, 100];

  return (
    <Card className="card-industrial relative group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onEdit}>
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FanIcon
              className={`h-5 w-5 ${
                fan.isRunning
                  ? "text-status-operational animate-spin-slow"
                  : "text-muted-foreground"
              }`}
            />
            <span className="font-medium">{fan.name}</span>
          </div>
          <StatusBadge
            status={
              fan.hasTrip
                ? "critical"
                : fan.isPowerOn
                ? "operational"
                : "offline"
            }
            size="sm"
          >
            {fan.hasTrip ? "TRIP" : fan.isPowerOn ? "ON" : "OFF"}
          </StatusBadge>
        </div>

        {/* Power toggle */}
        <div className="flex items-center gap-2">
          <ControlToggle
            variant="power"
            size="sm"
            isActive={fan.isPowerOn}
            isLoading={isControlling}
            icon={<Power className="h-4 w-4" />}
            onClick={() => onControl({ isPowerOn: !fan.isPowerOn })}
          >
            Power
          </ControlToggle>
        </div>

        {/* Direction controls */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Direction</p>
          <ControlToggleGroup>
            <ControlToggle
              variant="direction"
              size="sm"
              isActive={fan.direction === FanDirection.Backward}
              disabled={!fan.isPowerOn}
              icon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => onControl({ direction: FanDirection.Backward })}
            />
            <ControlToggle
              variant="neutral"
              size="sm"
              isActive={fan.direction === FanDirection.Stopped}
              disabled={!fan.isPowerOn}
              icon={<Square className="h-3 w-3" />}
              onClick={() => onControl({ direction: FanDirection.Stopped })}
            />
            <ControlToggle
              variant="direction"
              size="sm"
              isActive={fan.direction === FanDirection.Forward}
              disabled={!fan.isPowerOn}
              icon={<ArrowRight className="h-4 w-4" />}
              onClick={() => onControl({ direction: FanDirection.Forward })}
            />
          </ControlToggleGroup>
        </div>

        {/* Speed controls */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">
            Speed: <span className="font-mono">{fan.speed} RPM</span>
          </p>
          <ControlToggleGroup>
            {speeds.map((speed) => (
              <ControlToggle
                key={speed}
                variant="direction"
                size="sm"
                isActive={fan.speed === speed}
                disabled={!fan.isPowerOn}
                onClick={() => onControl({ speed })}
              >
                {speed === 0 ? "OFF" : speed}
              </ControlToggle>
            ))}
          </ControlToggleGroup>
        </div>
      </CardContent>
    </Card>
  );
}

// Light control card
interface LightControlCardProps {
  light: any;
  onControl: (isOn: boolean) => void;
  isControlling: boolean;
}

function LightControlCard({ light, onControl, isControlling }: LightControlCardProps) {
  return (
    <Card className="card-industrial">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb
              className={`h-5 w-5 ${
                light.isOn ? "text-status-warning" : "text-muted-foreground"
              }`}
            />
            <div>
              <span className="font-medium">{light.name}</span>
              {light.line && (
                <span className="text-xs text-muted-foreground ml-2">
                  Line {light.line}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <ControlToggle
            variant="power"
            size="md"
            isActive={light.isOn}
            isLoading={isControlling}
            icon={<Power className="h-4 w-4" />}
            onClick={() => onControl(!light.isOn)}
          >
            {light.isOn ? "Turn Off" : "Turn On"}
          </ControlToggle>
        </div>

        {(light.scheduleStart || light.scheduleEnd) && (
          <div className="text-xs text-muted-foreground bg-muted/30 rounded p-2">
            Schedule: {light.scheduleStart || "--"} → {light.scheduleEnd || "--"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
