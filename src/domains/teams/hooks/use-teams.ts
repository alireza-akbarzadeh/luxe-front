'use client';

import { useQueryClient } from '@tanstack/react-query';

import { useDeleteAdminTeamsId } from '@/services/-admin-teams-{id}-delete';
import { getGetAdminTeamsIdQueryKey, useGetAdminTeamsId } from '@/services/-admin-teams-{id}-get';
import { useDeleteAdminTeamsIdMembersUserId } from '@/services/-admin-teams-{id}-members-{userId}-delete';
import { usePostAdminTeamsIdMembers } from '@/services/-admin-teams-{id}-members-post';
import type { DtoAddTeamMemberRequest } from '@/services/-admin-teams-{id}-members-post.schemas';
import { usePutAdminTeamsId } from '@/services/-admin-teams-{id}-put';
import type { DtoUpdateTeamRequest } from '@/services/-admin-teams-{id}-put.schemas';
import { getGetAdminTeamsQueryKey, useGetAdminTeams } from '@/services/-admin-teams-get';
import { usePostAdminTeams } from '@/services/-admin-teams-post';
import type { DtoCreateTeamRequest } from '@/services/-admin-teams-post.schemas';

export function useTeams() {
  return useGetAdminTeams({
    query: {
      select: (response) => response.data ?? []
    }
  });
}

export function useTeam(id: number | null) {
  return useGetAdminTeamsId(id ?? 0, {
    query: {
      enabled: id != null,
      select: (response) => response.data ?? null
    }
  });
}

export function useTeamMutations() {
  const queryClient = useQueryClient();
  const createMutation = usePostAdminTeams();
  const updateMutation = usePutAdminTeamsId();
  const deleteMutation = useDeleteAdminTeamsId();
  const addMemberMutation = usePostAdminTeamsIdMembers();
  const removeMemberMutation = useDeleteAdminTeamsIdMembersUserId();

  const invalidate = async (teamId?: number) => {
    await queryClient.invalidateQueries({ queryKey: getGetAdminTeamsQueryKey() });
    if (teamId) {
      await queryClient.invalidateQueries({ queryKey: getGetAdminTeamsIdQueryKey(teamId) });
    }
  };

  return {
    createTeam: async (data: DtoCreateTeamRequest) => {
      const result = await createMutation.mutateAsync({ data });
      await invalidate(result.data?.id);
      return result;
    },
    updateTeam: async (variables: { id: number; data: DtoUpdateTeamRequest }) => {
      const result = await updateMutation.mutateAsync(variables);
      await invalidate(variables.id);
      return result;
    },
    deleteTeam: async (id: number) => {
      const result = await deleteMutation.mutateAsync({ id });
      await invalidate();
      return result;
    },
    addMember: async (variables: { teamId: number; data: DtoAddTeamMemberRequest }) => {
      const result = await addMemberMutation.mutateAsync({
        id: variables.teamId,
        data: variables.data
      });
      await invalidate(variables.teamId);
      return result;
    },
    removeMember: async (variables: { teamId: number; userId: number }) => {
      const result = await removeMemberMutation.mutateAsync({
        id: variables.teamId,
        userId: variables.userId
      });
      await invalidate(variables.teamId);
      return result;
    },
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isAddingMember: addMemberMutation.isPending,
    isRemovingMember: removeMemberMutation.isPending
  };
}
