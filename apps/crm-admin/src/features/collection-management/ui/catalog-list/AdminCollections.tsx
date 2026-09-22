import { useState } from "react";
import { AdminPageShell, AdminTable, AdminPagination } from "@shared/ui";
import { Button } from "@my-project/ui";
import { PlusIcon, ViewColumnsIcon, ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import { useCollections, useDeleteCollection, useToggleCollectionStatus } from "@entities/collection/hooks";
import type { CollectionDto } from "@entities/collection/types";
import { CollectionFormModal } from "../collection-form/CollectionFormModal";
import { AssignProductsModal } from "../collection-form/AssignProductsModal";
import { useCollectionColumns } from "./useCollectionColumns";

export function AdminCollections() {
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const { data, isLoading } = useCollections({ page, size });
  const deleteMut = useDeleteCollection();
  const toggleMut = useToggleCollectionStatus();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionDto | null>(null);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assigningCollection, setAssigningCollection] = useState<CollectionDto | null>(null);

  const handleCreate = () => {
    setEditingCollection(null);
    setFormModalOpen(true);
  };

  const handleEdit = (collection: CollectionDto) => {
    setEditingCollection(collection);
    setFormModalOpen(true);
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

  const total = data?.total ?? 0;
  const items = data?.items ?? [];
  const totalPages = Math.max(1, Math.ceil(total / size));

  const goPage = (p: number) => {
    setPage(p);
  };

  return (
    <AdminPageShell
      title="Quản lý Bộ Sưu Tập"
      icon={ViewColumnsIcon}
      badge={`${total} bộ sưu tập`}
      noCard
      actions={
        <Button onClick={handleCreate}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Thêm bộ sưu tập
        </Button>
      }
    >
      <div className="flex flex-col flex-1 min-h-0 bg-card shadow-none rounded-card overflow-hidden">
        <AdminTable<CollectionDto>
          columns={columns}
          data={items}
          isLoading={isLoading}
          skeletonRows={size}
          emptyIcon={ArchiveBoxXMarkIcon}
          emptyTitle="Chưa có bộ sưu tập nào"
          emptyDescription="Bấm Thêm bộ sưu tập để tạo mới."
          className="border-0 shadow-none rounded-none bg-transparent flex-1"
          footer={
            <AdminPagination
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={size}
              onPageChange={goPage}
            />
          }
        />
      </div>

      <CollectionFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        initialData={editingCollection}
      />

      {assigningCollection && (
        <AssignProductsModal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          collection={assigningCollection}
        />
      )}
    </AdminPageShell>
  );
}


