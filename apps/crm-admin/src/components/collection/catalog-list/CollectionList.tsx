import { useState, useMemo } from "react";
import { AdminPageShell, AdminTable } from "@shared/ui";
import { ViewColumnsIcon, ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import { useCollections, useDeleteCollection, useToggleCollectionStatus } from "@hooks/useCollection";
import type { CollectionDto } from "@my-project/api";
import { CollectionDrawerForm } from "../collection-form/CollectionDrawerForm";
import { AssignProductsModal } from "../collection-form/AssignProductsModal";
import { useCollectionColumns } from "./useCollectionColumns";
import { useDrawerSearchParams } from "@hooks/useDrawerSearchParams";

export function CollectionList() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const { data, isLoading } = useCollections({ page, size });
  const deleteMut = useDeleteCollection();
  const toggleMut = useToggleCollectionStatus();

  const {
    isOpen: isDrawerOpen,
    editingId,
    openCreate,
    openEdit,
    closeDrawer,
  } = useDrawerSearchParams();

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assigningCollection, setAssigningCollection] = useState<CollectionDto | null>(null);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / size));

  const editingCollection = useMemo(() => {
    if (!editingId) return null;
    return items.find((c) => c.id === Number(editingId)) ?? null;
  }, [items, editingId]);

  const handleEdit = (collection: CollectionDto) => {
    openEdit(collection.id);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa bộ sưu tập "${name}"?`)) {
      deleteMut.mutate(id);
    }
  };

  const handleToggleStatus = (id: number) => {
    toggleMut.mutate(id);
  };

  const handleAssignProducts = (collection: CollectionDto) => {
    setAssigningCollection(collection);
    setAssignModalOpen(true);
  };

  const columns = useCollectionColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onAssignProducts: handleAssignProducts,
    onToggleStatus: handleToggleStatus,
    isTogglePending: toggleMut.isPending,
    isDeletePending: deleteMut.isPending,
  });

  const goPage = (p: number) => {
    setPage(p);
  };

  return (
    <AdminPageShell>
      <AdminPageShell.Header
        title="Quản lý Bộ Sưu Tập"
        icon={ViewColumnsIcon}
        badge={`${total} bộ sưu tập`}
        createAction={{
          onClick: openCreate,
          label: "Thêm bộ sưu tập",
        }}
      />
      <AdminPageShell.Body>
        <AdminTable<CollectionDto>
          columns={columns}
          data={items}
          isLoading={isLoading}
          rowKey="id"
          activeRowKey={editingId}
          enableCardView={true}
          storageKey="crm_collection_view_mode"
          pagination={{
            page,
            total,
            pageSize: size,
            onPageChange: goPage,
            onPageSizeChange: (s) => {
              setSize(s);
              setPage(1);
            },
          }}
          emptyText="Chưa có bộ sưu tập nào"
          emptyIcon={ArchiveBoxXMarkIcon}
          className="border-0 shadow-none rounded-none bg-transparent flex-1"
        />

        {assigningCollection && (
          <AssignProductsModal
            isOpen={assignModalOpen}
            onClose={() => setAssignModalOpen(false)}
            collection={assigningCollection}
          />
        )}
      </AdminPageShell.Body>
      <AdminPageShell.Inspector>
        <CollectionDrawerForm
          open={isDrawerOpen}
          onClose={closeDrawer}
          collection={editingCollection}
        />
      </AdminPageShell.Inspector>
    </AdminPageShell>
  );
}

export const AdminCollections = CollectionList;
export default CollectionList;
