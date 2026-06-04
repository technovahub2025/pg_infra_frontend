import { useState } from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '../utils/motionVariants';
import { useChangeMemberRole, useInviteMember, usePendingInvites, useRemoveMember, useRevokeInvite, useResendInvite, useTeamMembers } from '../hooks/useTeam';
import { TeamMemberCard } from '../components/team/TeamMemberCard';
import { InviteModal } from '../components/team/InviteModal';
import { PendingInviteList } from '../components/team/PendingInviteList';
import { RoleChangeModal } from '../components/team/RoleChangeModal';
import { SkeletonCard } from '../components/shared/SkeletonCard';
import { EmptyState } from '../components/shared/EmptyState';
import { Button } from '../components/ui/button';

export default function TeamPage() {
  const membersQuery = useTeamMembers();
  const invitesQuery = usePendingInvites();
  const inviteMember = useInviteMember();
  const resendInvite = useResendInvite();
  const revokeInvite = useRevokeInvite();
  const changeRole = useChangeMemberRole();
  const removeMember = useRemoveMember();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const members = membersQuery.data || [];
  const invites = invitesQuery.data || [];

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6 pb-8">
      <section className="theme-hero theme-hero-blue p-5 sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="hero-kicker">Team</p>
            <h1 className="hero-title">Team and role management</h1>
            <p className="hero-subtitle max-w-3xl">Invite members, review pending invites, and change roles for the live team.</p>
          </div>
          <Button onClick={() => setInviteOpen(true)}>Invite Member</Button>
        </div>
      </section>

      {(membersQuery.isLoading || invitesQuery.isLoading) ? <SkeletonCard /> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.6fr)]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {members.length ? members.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onEdit={(row) => {
                setSelectedMember(row);
                setRoleOpen(true);
              }}
              onChangeRole={(row) => {
                setSelectedMember(row);
                setRoleOpen(true);
              }}
              onRemove={(row) => removeMember.mutate(row.id)}
            />
          )) : <EmptyState title="No team members" description="Invite someone to start building the team." />}
        </div>
        <PendingInviteList
          invites={invites}
          onResend={(row) => resendInvite.mutate(row.id)}
          onRevoke={(row) => revokeInvite.mutate(row.id)}
        />
      </div>

      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSubmit={async (payload) => {
          await inviteMember.mutateAsync(payload);
          setInviteOpen(false);
        }}
      />

      <RoleChangeModal
        open={roleOpen}
        initialValues={selectedMember}
        onClose={() => setRoleOpen(false)}
        onSubmit={async (payload) => {
          if (selectedMember) {
            await changeRole.mutateAsync({ id: selectedMember.id, payload });
          }
          setRoleOpen(false);
        }}
      />
    </motion.div>
  );
}
