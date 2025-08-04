import React, { useState } from 'react';
import { User, Key, Globe, Palette, Users, Shield, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Role {
  id: string;
  name: string;
  permissions: {
    dashboard: boolean;
    batches: boolean;
    inventory: boolean;
    costs: boolean;
    reports: boolean;
    settings: boolean;
  };
  userCount: number;
}

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Factory Manager',
    permissions: {
      dashboard: true,
      batches: true,
      inventory: true,
      costs: true,
      reports: true,
      settings: true,
    },
    userCount: 2,
  },
  {
    id: '2',
    name: 'Production Head',
    permissions: {
      dashboard: true,
      batches: true,
      inventory: true,
      costs: false,
      reports: true,
      settings: false,
    },
    userCount: 3,
  },
  {
    id: '3',
    name: 'Accountant',
    permissions: {
      dashboard: true,
      batches: false,
      inventory: false,
      costs: true,
      reports: true,
      settings: false,
    },
    userCount: 1,
  },
  {
    id: '4',
    name: 'Operator',
    permissions: {
      dashboard: true,
      batches: true,
      inventory: false,
      costs: false,
      reports: false,
      settings: false,
    },
    userCount: 8,
  },
];

const Settings = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');

  const handlePermissionChange = (roleId: string, permission: string, value: boolean) => {
    setRoles(roles.map(role => 
      role.id === roleId 
        ? { ...role, permissions: { ...role.permissions, [permission]: value } }
        : role
    ));
  };

  const generateApiKey = () => {
    const key = 'eak_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setNewApiKey(key);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage system configuration and user permissions
          </p>
        </div>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Role & Permissions Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {roles.map((role) => (
                  <div key={role.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{role.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {role.userCount} users assigned
                        </p>
                      </div>
                      <Badge variant="outline">{role.userCount} users</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(role.permissions).map(([permission, enabled]) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Switch
                            id={`${role.id}-${permission}`}
                            checked={enabled}
                            onCheckedChange={(value) => 
                              handlePermissionChange(role.id, permission, value)
                            }
                          />
                          <Label 
                            htmlFor={`${role.id}-${permission}`}
                            className="capitalize text-sm"
                          >
                            {permission}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <Button className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Add New Role
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Use API keys to integrate Eagle's Eye with external systems and applications.
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key Name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Production Integration</TableCell>
                    <TableCell>Jan 15, 2024</TableCell>
                    <TableCell>2 hours ago</TableCell>
                    <TableCell>
                      <Badge variant="default">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Rotate
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Analytics Dashboard</TableCell>
                    <TableCell>Jan 10, 2024</TableCell>
                    <TableCell>Never</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Inactive</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Rotate
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Button onClick={() => setShowApiKeyModal(true)}>
                <Key className="h-4 w-4 mr-2" />
                Generate New Key
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Localization Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Date Format</Label>
                  <Select defaultValue="mm/dd/yyyy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Time Zone</Label>
                  <Select defaultValue="est">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="cet">Central European Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch />
              </div>

              <div className="space-y-3">
                <Label>Color Scheme</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border rounded-lg p-3 cursor-pointer hover:bg-secondary">
                    <div className="flex gap-2 mb-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <div className="w-4 h-4 bg-blue-300 rounded"></div>
                      <div className="w-4 h-4 bg-blue-100 rounded"></div>
                    </div>
                    <p className="text-sm">Blue (Default)</p>
                  </div>
                  <div className="border rounded-lg p-3 cursor-pointer hover:bg-secondary">
                    <div className="flex gap-2 mb-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <div className="w-4 h-4 bg-green-300 rounded"></div>
                      <div className="w-4 h-4 bg-green-100 rounded"></div>
                    </div>
                    <p className="text-sm">Green</p>
                  </div>
                  <div className="border rounded-lg p-3 cursor-pointer hover:bg-secondary">
                    <div className="flex gap-2 mb-2">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <div className="w-4 h-4 bg-purple-300 rounded"></div>
                      <div className="w-4 h-4 bg-purple-100 rounded"></div>
                    </div>
                    <p className="text-sm">Purple</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">
                    Disable animations for better accessibility
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* API Key Generation Modal */}
      <Dialog open={showApiKeyModal} onOpenChange={setShowApiKeyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate New API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Key Name</Label>
              <Input placeholder="Enter a name for this API key" />
            </div>
            <div>
              <Label>Permissions</Label>
              <div className="space-y-2 pt-2">
                <div className="flex items-center space-x-2">
                  <Switch id="read-batches" />
                  <Label htmlFor="read-batches">Read Batches</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="write-batches" />
                  <Label htmlFor="write-batches">Write Batches</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="read-inventory" />
                  <Label htmlFor="read-inventory">Read Inventory</Label>
                </div>
              </div>
            </div>
            
            {newApiKey && (
              <div>
                <Label>Generated API Key</Label>
                <div className="flex gap-2">
                  <Input value={newApiKey} readOnly />
                  <Button variant="outline" onClick={() => navigator.clipboard.writeText(newApiKey)}>
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Save this key securely. It won't be shown again.
                </p>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowApiKeyModal(false)}>
                Cancel
              </Button>
              <Button onClick={generateApiKey}>
                Generate Key
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;