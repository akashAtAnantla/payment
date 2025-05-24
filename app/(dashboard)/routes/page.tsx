'use client';

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { toggleRouteActive } from '@/lib/redux/features/routes-slice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GitBranch, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function RoutesPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { routes } = useAppSelector(state => state.routes);
  
  const isSuperAdmin = user?.role === 'superAdmin';
  
  const handleToggleActive = (routeId: string) => {
    dispatch(toggleRouteActive(routeId));
  };
  
  // Get method color based on payment method
  const getMethodColor = (method: string) => {
    switch (method) {
      case 'Credit Card':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Debit Card':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'PayPal':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'Apple Pay':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'Google Pay':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'Bank Transfer':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
      case 'Cryptocurrency':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Buy Now Pay Later':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  // Get priority label
  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return 'High';
      case 2:
        return 'Medium';
      case 3:
        return 'Low';
      default:
        return 'Unknown';
    }
  };
  
  // Get priority color
  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return 'text-red-600 dark:text-red-400';
      case 2:
        return 'text-amber-600 dark:text-amber-400';
      case 3:
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Routes</h1>
        <p className="text-muted-foreground">
          View and manage payment routing configurations.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <GitBranch className="h-5 w-5 mr-2" />
            Payment Routes
          </CardTitle>
          <CardDescription>
            Configure how transactions are routed through payment gateways
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Route Name</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-center">
                          Priority
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Lower number = Higher priority</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="text-center">Success Rate</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">
                    <div>{route.name}</div>
                    <div className="text-xs text-muted-foreground">{route.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getMethodColor(route.method)}`}>
                      {route.method}
                    </Badge>
                  </TableCell>
                  <TableCell>{route.country}</TableCell>
                  <TableCell className="text-center">
                    <span className={`font-medium ${getPriorityColor(route.priority)}`}>
                      {getPriorityLabel(route.priority)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-full max-w-[100px] bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            route.successRate >= 98 ? 'bg-green-500' :
                            route.successRate >= 95 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${route.successRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium whitespace-nowrap">{route.successRate.toFixed(1)}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={route.isActive}
                      onCheckedChange={() => handleToggleActive(route.id)}
                      aria-label={`${route.name} status`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}