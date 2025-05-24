// components/connections/connections-client.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
  setSelectedCountry,
  setSelectedMethods,
  addGateway,
  editGateway,
  setGatewayVisibility,
  toggleMerchantGatewayActive,
} from "@/lib/redux/features/connections-slice";
import {
  Country,
  Gateway,
  PaymentMethod,
  GatewayConfigStep,
  Merchant,
} from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Link2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Define countries and payment methods at top level
const countries: Country[] = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "Japan",
  "Brazil",
  "Mexico",
  "India",
];
const paymentMethods: PaymentMethod[] = [
  "Credit Card",
  "Debit Card",
  "PayPal",
  "Apple Pay",
  "Google Pay",
  "Bank Transfer",
  "Cryptocurrency",
  "Buy Now Pay Later",
  "UPI",
  "Net Banking",
  "Wallet",
];

interface ConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  keyword: string;
  actionDescription: string;
}

function ConfirmationModal({
  isOpen,
  onOpenChange,
  onConfirm,
  keyword,
  actionDescription,
}: ConfirmationModalProps) {
  const [inputValue, setInputValue] = useState("");
  const isInputValid = inputValue === keyword;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to apply these changes?
          </DialogTitle>
          <DialogDescription>
            This action may affect live payment configurations. To confirm,
            please type the keyword shown below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Keyword</Label>
            <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
              {keyword}
            </p>
          </div>
          <div>
            <Label htmlFor="confirm-input">Confirm {actionDescription}</Label>
            <Input
              id="confirm-input"
              placeholder="Type here to confirm..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setInputValue("");
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!isInputValid}
            onClick={() => {
              onConfirm();
              setInputValue("");
              onOpenChange(false);
            }}
          >
            Confirm and Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ConfigModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gateway: Gateway | null; // Updated to allow null
  isAddMode: boolean;
}

function ConfigModal({
  isOpen,
  onOpenChange,
  gateway,
  isAddMode,
}: ConfigModalProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(isAddMode ? "add" : "manage");
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Gateway>>(
    gateway || {
      name: "",
      methods: [],
      countries: [],
      isActive: true,
      config: {},
    }
  );

  // Predefined steps per gateway
  const gatewaySteps: Record<string, GatewayConfigStep[]> = {
    Stripe: [
      { label: "API Key", placeholder: "sk_live_xxx", type: "text" },
      {
        label: "Webhook URL",
        placeholder: "https://yourdomain.com/webhook",
        type: "url",
      },
      {
        label: "Webhook Secret",
        placeholder: "whsec_abc123",
        type: "password",
      },
    ],
    PayPal: [
      { label: "Client ID", placeholder: "paypal_client_123", type: "text" },
      { label: "Secret", placeholder: "paypal_secret_456", type: "password" },
    ],
    Razorpay: [
      { label: "Key ID", placeholder: "rzp_key_789", type: "text" },
      { label: "Key Secret", placeholder: "rzp_secret_012", type: "password" },
    ],
    Default: [{ label: "API Key", placeholder: "Enter API key", type: "text" }],
  };

  // Gateway summaries
  const gatewaySummaries: Record<string, string> = {
    Stripe:
      "Stripe provides a robust platform for global payments, supporting cards, digital wallets, and more, with advanced fraud detection and customizable checkout flows.",
    PayPal:
      "PayPal enables secure online payments with support for PayPal accounts, cards, and international transactions, ideal for e-commerce.",
    Razorpay:
      "Razorpay offers a seamless checkout experience for Indian businesses with features like UPI, cards, net banking, supporting real-time transaction tracking and robust failure handling.",
    Default:
      "This payment gateway provides standard payment processing capabilities.",
  };

  const steps =
    gatewaySteps[formData.name || "Default"] || gatewaySteps.Default;
  const summary =
    gatewaySummaries[formData.name || "Default"] || gatewaySummaries.Default;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      config: { ...prev.config, [field]: value },
    }));
  };

  const handleSave = () => {
    if (
      !formData.name ||
      !formData.countries?.length ||
      !formData.methods?.length
    ) {
      toast({
        title: "Invalid Input",
        description:
          "Please provide a name, at least one country, and one payment method.",
        variant: "destructive",
      });
      return;
    }

    const payload: Gateway = {
      id: formData.id || `gateway-${Date.now()}`,
      name: formData.name,
      methods: formData.methods || [],
      countries: formData.countries || [],
      isActive: formData.isActive ?? true,
      createdAt: formData.createdAt || new Date().toISOString(),
      config: formData.config || {},
    };

    if (isAddMode) {
      dispatch(addGateway(payload));
      toast({
        title: "Gateway Added",
        description: `${formData.name} has been added successfully.`,
      });
    } else {
      dispatch(editGateway(payload));
      toast({
        title: "Gateway Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    }
    onOpenChange(false);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSave();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {isAddMode
              ? "Add New Payment Gateway"
              : `Configure ${formData.name}`}
          </DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {isAddMode ? (
              <TabsTrigger value="add">Add Gateway</TabsTrigger>
            ) : (
              <>
                <TabsTrigger value="manage">Manage/Update Gateway</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </>
            )}
          </TabsList>
          <TabsContent value="add">
            <div className="flex">
              <div className="w-1/3 pr-4">
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-2 rounded ${
                        currentStep === index
                          ? "bg-blue-100 dark:bg-blue-900"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${
                          currentStep >= index
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="ml-2">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-2/3 pl-4 border-l">
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Gateway Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Stripe, PayPal"
                        value={formData.name || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Countries/Regions</Label>
                      <div className="flex flex-wrap gap-2">
                        {countries.map((country) => (
                          <Button
                            key={country}
                            type="button"
                            variant={
                              formData.countries?.includes(country)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className="rounded-full"
                            onClick={() =>
                              setFormData((prev) => {
                                const countries = prev.countries || [];
                                return {
                                  ...prev,
                                  countries: countries.includes(country)
                                    ? countries.filter((c) => c !== country)
                                    : [...countries, country],
                                };
                              })
                            }
                          >
                            {country}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Payment Methods</Label>
                      <div className="flex flex-wrap gap-2">
                        {paymentMethods.map((method) => (
                          <Button
                            key={method}
                            type="button"
                            variant={
                              formData.methods?.includes(method)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className="rounded-full"
                            onClick={() =>
                              setFormData((prev) => {
                                const methods = prev.methods || [];
                                return {
                                  ...prev,
                                  methods: methods.includes(method)
                                    ? methods.filter((m) => m !== method)
                                    : [...methods, method],
                                };
                              })
                            }
                          >
                            {method}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {currentStep > 0 && (
                  <div className="space-y-4">
                    <Label htmlFor={`step-${currentStep}`}>
                      {steps[currentStep].label}
                    </Label>
                    <Input
                      id={`step-${currentStep}`}
                      type={steps[currentStep].type}
                      placeholder={steps[currentStep].placeholder}
                      value={formData.config?.[steps[currentStep].label] || ""}
                      onChange={(e) =>
                        handleInputChange(
                          steps[currentStep].label,
                          e.target.value
                        )
                      }
                    />
                  </div>
                )}
                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    disabled={currentStep === 0}
                    onClick={handlePrevStep}
                  >
                    Previous
                  </Button>
                  <Button onClick={handleNextStep}>
                    {currentStep === steps.length - 1 ? "Save" : "Next"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          {!isAddMode && (
            <>
              <TabsContent value="manage">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Gateway Name</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Countries/Regions</Label>
                    <div className="flex flex-wrap gap-2">
                      {countries.map((country) => (
                        <Button
                          key={country}
                          type="button"
                          variant={
                            formData.countries?.includes(country)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="rounded-full"
                          onClick={() =>
                            setFormData((prev) => {
                              const countries = prev.countries || [];
                              return {
                                ...prev,
                                countries: countries.includes(country)
                                  ? countries.filter((c) => c !== country)
                                  : [...countries, country],
                              };
                            })
                          }
                        >
                          {country}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Payment Methods</Label>
                    <div className="flex flex-wrap gap-2">
                      {paymentMethods.map((method) => (
                        <Button
                          key={method}
                          type="button"
                          variant={
                            formData.methods?.includes(method)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="rounded-full"
                          onClick={() =>
                            setFormData((prev) => {
                              const methods = prev.methods || [];
                              return {
                                ...prev,
                                methods: methods.includes(method)
                                  ? methods.filter((m) => m !== method)
                                  : [...methods, method],
                              };
                            })
                          }
                        >
                          {method}
                        </Button>
                      ))}
                    </div>
                  </div>
                  {steps.map((step, index) => (
                    <div key={index}>
                      <Label htmlFor={`config-${step.label}`}>
                        {step.label}
                      </Label>
                      <Input
                        id={`config-${step.label}`}
                        type={step.type}
                        placeholder={step.placeholder}
                        value={formData.config?.[step.label] || ""}
                        onChange={(e) =>
                          handleInputChange(step.label, e.target.value)
                        }
                      />
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.isActive ?? true}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isActive: checked })
                      }
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSave}>Save Changes</Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="summary">
                <div className="prose dark:prose-invert">
                  <p>{summary}</p>
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Close
                  </Button>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface ConnectionsClientProps {
  isSuperAdminView: boolean;
  merchantId?: string;
}

export default function ConnectionsClient({
  isSuperAdminView,
  merchantId,
}: ConnectionsClientProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const { user, currentMerchantContext } = useAppSelector(
    (state) => state.auth
  );
  const {
    gateways,
    visiblePaymentGateways,
    selectedCountry,
    selectedMethods,
    isLoading,
  } = useAppSelector((state) => state.connections);
  const { merchants } = useAppSelector((state) => state.merchants);

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmKeyword, setConfirmKeyword] = useState("");
  const [confirmActionDescription, setConfirmActionDescription] = useState("");
  const [selectedGateway, setSelectedGateway] = useState<Gateway | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Client-side redirects
  if (!user) {
    router.replace("/login");
    return null;
  }

  if (isSuperAdminView && user.role !== "superAdmin") {
    router.replace(`/dashboard/${user.merchantId}/connections`);
    return null;
  }

  if (
    !isSuperAdminView &&
    user.role === "merchantAdmin" &&
    merchantId &&
    user.merchantId !== merchantId
  ) {
    router.replace(`/dashboard/${user.merchantId}/connections`);
    return null;
  }

  const isSuperAdmin = user?.role === "superAdmin";
  const currentMerchant = merchantId
    ? merchants.find((m) => m.id === merchantId)
    : null;
  const isImpersonationMode =
    isSuperAdmin &&
    !!merchantId &&
    !!currentMerchantContext &&
    !isSuperAdminView;

  // Chart data: Active merchants per gateway
  const chartData = useMemo(() => {
    return gateways.map((gateway) => {
      const activeMerchants = merchants.filter((merchant) =>
        (visiblePaymentGateways[merchant.id] || []).some(
          (mg) => mg.gatewayId === gateway.id && mg.isActive
        )
      ).length;
      return {
        name: gateway.name,
        activeMerchants,
      };
    });
  }, [gateways, visiblePaymentGateways, merchants]);

  // Filter gateways
  const filteredGateways = useMemo(() => {
    return gateways.filter((gateway) => {
      const countryMatch =
        !selectedCountry || gateway.countries.includes(selectedCountry);
      const methodMatch =
        selectedMethods.length === 0 ||
        selectedMethods.every((method) => gateway.methods.includes(method));
      const visibilityMatch =
        isSuperAdminView || isSuperAdmin
          ? true
          : (visiblePaymentGateways[merchantId || ""] || []).some(
              (mg) => mg.gatewayId === gateway.id
            );
      return countryMatch && methodMatch && visibilityMatch;
    });
  }, [
    gateways,
    visiblePaymentGateways,
    selectedCountry,
    selectedMethods,
    isSuperAdmin,
    isSuperAdminView,
    merchantId,
  ]);

  // Define columns
  const columns: ColumnDef<Gateway>[] = [
    {
      accessorKey: "name",
      header: "Payment Gateway",
      cell: ({ row }) => (
        <div>
          <span className="font-medium">{row.original.name}</span>
          <div className="text-xs text-muted-foreground">
            Created: {new Date(row.original.createdAt).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "methods",
      header: "Payment Methods",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.methods.map((method) => (
            <Badge key={method} variant="outline">
              {method}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "countries",
      header: "Supported Regions",
      cell: ({ row }) => row.original.countries.join(", "),
    },
    {
      accessorKey: "active",
      header: "Active Status",
      cell: ({ row }) => {
        const effectiveMerchantId = merchantId;
        const merchantGateway = effectiveMerchantId
          ? (visiblePaymentGateways[effectiveMerchantId] || []).find(
              (mg) => mg.gatewayId === row.original.id
            )
          : null;
        const isGloballyActive = isSuperAdminView
          ? merchants.every((m) =>
              (visiblePaymentGateways[m.id] || []).find(
                (mg) => mg.gatewayId === row.original.id && mg.isActive
              )
            )
          : merchantGateway?.isActive ?? false;
        return (
          <Switch
            checked={isGloballyActive}
            disabled={user.role === "merchantAdmin" && !merchantGateway}
            onCheckedChange={(checked) => {
              const gatewayName = row.original.name;
              if (isSuperAdminView) {
                setConfirmKeyword("GLOBAL-CONFIRM");
                setConfirmActionDescription(
                  `global status change for ${gatewayName}`
                );
                setConfirmAction(() => () => {
                  merchants.forEach((merchant) => {
                    dispatch(
                      toggleMerchantGatewayActive({
                        merchantId: merchant.id,
                        gatewayId: row.original.id,
                        forceInactive: !checked,
                      })
                    );
                  });
                  toast({
                    title: "Global Status Updated",
                    description: `${gatewayName} is now ${
                      checked ? "active" : "inactive"
                    } for all merchants.`,
                  });
                });
                setIsConfirmModalOpen(true);
              } else if (effectiveMerchantId && merchantGateway) {
                setConfirmKeyword(currentMerchant?.name || effectiveMerchantId);
                setConfirmActionDescription(`status change for ${gatewayName}`);
                setConfirmAction(() => () => {
                  dispatch(
                    toggleMerchantGatewayActive({
                      merchantId: effectiveMerchantId,
                      gatewayId: row.original.id,
                      forceInactive: !checked,
                    })
                  );
                  toast({
                    title: "Status Updated",
                    description: `${gatewayName} is now ${
                      checked ? "active" : "inactive"
                    } for merchant ${
                      currentMerchant?.name || effectiveMerchantId
                    }.`,
                  });
                });
                setIsConfirmModalOpen(true);
              }
            }}
          />
        );
      },
    },
    ...(isSuperAdminView || isImpersonationMode
      ? [
          {
            accessorKey: "visible",
            header: "Visibility",
            cell: ({ row }: any) => {
              const effectiveMerchantId = merchantId;
              const isGloballyVisible = isSuperAdminView
                ? merchants.every((m) =>
                    (visiblePaymentGateways[m.id] || []).some(
                      (mg) => mg.gatewayId === row.original.id
                    )
                  )
                : effectiveMerchantId
                ? (visiblePaymentGateways[effectiveMerchantId] || []).some(
                    (mg) => mg.gatewayId === row.original.id
                  )
                : false;
              return (
                <Switch
                  checked={isGloballyVisible}
                  onCheckedChange={(checked) => {
                    const gatewayName = row.original.name;
                    if (isSuperAdminView) {
                      setConfirmKeyword("GLOBAL-CONFIRM");
                      setConfirmActionDescription(
                        `global visibility change for ${gatewayName}`
                      );
                      setConfirmAction(() => () => {
                        merchants.forEach((merchant) => {
                          dispatch(
                            setGatewayVisibility({
                              merchantId: merchant.id,
                              gatewayId: row.original.id,
                              visible: checked,
                            })
                          );
                        });
                        toast({
                          title: "Global Visibility Updated",
                          description: `${gatewayName} is now ${
                            checked ? "visible" : "hidden"
                          } for all merchants.`,
                        });
                      });
                      setIsConfirmModalOpen(true);
                    } else if (effectiveMerchantId) {
                      setConfirmKeyword(
                        currentMerchant?.name || effectiveMerchantId
                      );
                      setConfirmActionDescription(
                        `visibility change for ${gatewayName}`
                      );
                      setConfirmAction(() => () => {
                        dispatch(
                          setGatewayVisibility({
                            merchantId: effectiveMerchantId,
                            gatewayId: row.original.id,
                            visible: checked,
                          })
                        );
                        toast({
                          title: "Visibility Updated",
                          description: `${gatewayName} is now ${
                            checked ? "visible" : "hidden"
                          } for merchant ${
                            currentMerchant?.name || effectiveMerchantId
                          }.`,
                        });
                      });
                      setIsConfirmModalOpen(true);
                    }
                  }}
                />
              );
            },
          },
          {
            id: "config",
            header: "Configuration",
            cell: ({ row }: any) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedGateway(row.original);
                  setIsAddMode(false);
                  setIsConfigModalOpen(true);
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                Config
              </Button>
            ),
          },
        ]
      : []),
  ];

  // TanStack Table setup
  const table = useReactTable({
    data: filteredGateways,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  // Handlers
  const handleCountryChange = (value: string) => {
    dispatch(setSelectedCountry(value === "all" ? null : (value as Country)));
  };

  const handleMethodToggle = (method: PaymentMethod) => {
    const newMethods = selectedMethods.includes(method)
      ? selectedMethods.filter((m) => m !== method)
      : [...selectedMethods, method];
    dispatch(setSelectedMethods(newMethods));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Payment Gateways
          </h1>
          <p className="text-muted-foreground">
            {isSuperAdminView
              ? "Manage global payment gateway configurations"
              : isImpersonationMode
              ? `Configure gateways for ${currentMerchant?.name}`
              : "Toggle active status for your available payment gateways"}
          </p>
        </div>
        {(isSuperAdminView || isImpersonationMode) && (
          <Button
            onClick={() => {
              setSelectedGateway(null);
              setIsAddMode(true);
              setIsConfigModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Gateway
          </Button>
        )}
      </div>

      {isImpersonationMode && merchantId && (
        <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Managing payment gateways for merchant:{" "}
            <span className="font-bold">
              {currentMerchant?.name} (ID: {merchantId})
            </span>
          </p>
        </div>
      )}

      {isSuperAdminView && (
        <Card>
          <CardHeader>
            <CardTitle>Gateway Usage</CardTitle>
            <CardDescription>
              Number of active merchants per gateway
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart width={600} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="activeMerchants" fill="#3b82f6" />
            </BarChart>
          </CardContent>
        </Card>
      )}

      <ConfigModal
        isOpen={isConfigModalOpen}
        onOpenChange={setIsConfigModalOpen}
        gateway={selectedGateway}
        isAddMode={isAddMode}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        onConfirm={() => confirmAction?.()}
        keyword={confirmKeyword}
        actionDescription={confirmActionDescription}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Link2 className="h-5 w-5 mr-2" />
            Payment Gateways
          </CardTitle>
          <CardDescription>
            {isSuperAdminView
              ? "Manage global payment gateway configurations"
              : isImpersonationMode
              ? `Configure gateways for ${currentMerchant?.name}`
              : "Toggle active status for your available payment gateways"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full md:w-[280px]">
              <Select
                value={selectedCountry || "all"}
                onValueChange={handleCountryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <Button
                  key={method}
                  variant={
                    selectedMethods.includes(method) ? "default" : "outline"
                  }
                  size="sm"
                  className="rounded-full"
                  onClick={() => handleMethodToggle(method)}
                >
                  {method}
                </Button>
              ))}
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredGateways.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No gateways available for the selected criteria.
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="p-3 text-left font-medium"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.isPlaceholder ? null : (
                            <div className="flex items-center">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: " ↑",
                                desc: " ↓",
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-b">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-3">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
