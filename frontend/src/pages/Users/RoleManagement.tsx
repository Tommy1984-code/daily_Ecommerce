import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { useAuth } from "../../context/AuthContext";
import {
  getRoles,
  getResources,
  assignPermission,
  createRole,
  type Role,
  type Resource,
} from "../../services/rbacService";

export default function RoleManagement() {
  const { isSuperAdmin } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  async function fetchData() {
    try {
      const [rls, res] = await Promise.all([getRoles(), getResources()]);
      setRoles(rls);
      setResources(res);
    } catch (err) {
      console.error("Failed to fetch roles/resources", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleTogglePermission(
    roleId: string,
    resourceId: string,
    action: "canRead" | "canWrite" | "canDelete",
    value: boolean,
  ) {
    const key = `${roleId}-${resourceId}`;
    setSaving(key);
    try {
      await assignPermission(roleId, resourceId, { [action]: value });
      await fetchData();
    } catch (err) {
      console.error("Failed to update permission", err);
    } finally {
      setSaving(null);
    }
  }

  async function handleCreateRole() {
    if (!newRoleName.trim()) return;
    try {
      await createRole(newRoleName.trim(), newRoleDesc.trim() || undefined);
      setShowCreateModal(false);
      setNewRoleName("");
      setNewRoleDesc("");
      await fetchData();
    } catch (err) {
      console.error("Failed to create role", err);
    }
  }

  function getPermission(role: Role, resourceId: string) {
    return role.permissions.find((p) => p.resourceId === resourceId);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading roles...</p>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Role Management | Dashboard"
        description="Manage roles and their permissions"
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
            Role Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure which modules each role can access
          </p>
        </div>
        {isSuperAdmin && (
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            + Add Role
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                  Role
                </TableCell>
                {resources.map((res) => (
                  <TableCell
                    key={res.id}
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 capitalize whitespace-nowrap"
                  >
                    {res.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="px-5 py-3 sm:px-6 text-start whitespace-nowrap">
                    <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {role.name}
                    </span>
                    {role.isSystem && (
                      <span className="ml-2 text-xs text-gray-400">(System)</span>
                    )}
                  </TableCell>
                  {resources.map((res) => {
                    const perm = getPermission(role, res.id);
                    const key = `${role.id}-${res.id}`;
                    const loadingPerm = saving === key;
                    return (
                      <TableCell key={res.id} className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={perm?.canRead ?? false}
                              disabled={loadingPerm}
                              onChange={(e) =>
                                handleTogglePermission(
                                  role.id,
                                  res.id,
                                  "canRead",
                                  e.target.checked,
                                )
                              }
                              className="rounded border-gray-300"
                            />
                            R
                          </label>
                          <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={perm?.canWrite ?? false}
                              disabled={loadingPerm}
                              onChange={(e) =>
                                handleTogglePermission(
                                  role.id,
                                  res.id,
                                  "canWrite",
                                  e.target.checked,
                                )
                              }
                              className="rounded border-gray-300"
                            />
                            W
                          </label>
                          <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={perm?.canDelete ?? false}
                              disabled={loadingPerm}
                              onChange={(e) =>
                                handleTogglePermission(
                                  role.id,
                                  res.id,
                                  "canDelete",
                                  e.target.checked,
                                )
                              }
                              className="rounded border-gray-300"
                            />
                            D
                          </label>
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        className="max-w-md p-6"
      >
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Create New Role
          </h2>

          <div>
            <Label>Role Name</Label>
            <Input
              placeholder="e.g. Support Agent"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
          </div>

          <div>
            <Label>Description (optional)</Label>
            <Input
              placeholder="What this role can do"
              value={newRoleDesc}
              onChange={(e) => setNewRoleDesc(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateRole}>
              Create Role
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
