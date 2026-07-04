import {
  IconAward,
  IconBell,
  IconBooks,
  IconBriefcase,
  IconCalendarEvent,
  IconCreditCard,
  IconDashboard,
  IconFileText,
  IconHelp,
  IconHierarchy,
  IconLockSquare,
  IconMail,
  IconPresentation,
  IconReceipt2,
  IconSchool,
  IconSearch,
  IconSettings,
  IconUser,
  IconUsers,
  IconVideo,
} from "@tabler/icons-react"

export const data = {
  user: {
    name: "User Name",
    email: "user@fch.org",
    avatar: "/avatars/avatar.jpg",
  },
  adminMenu: [
    {
      title: "Admin Overview",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Manage Users",
      url: "/admin/members",
      icon: IconUsers,
    },
    {
      title: "Memberships Manager",
      url: "/admin/memberships",
      icon: IconAward,
      items: [
        {
          title: "Status Manager",
          url: "/admin/memberships",
        },
        {
          title: "Membership Packages",
          url: "/admin/membership-packages",
        },
      ],
    },
    {
      title: "Board Access",
      url: "/admin/board-management",
      icon: IconLockSquare,
    },
    {
      title: "Donation & Payments ",
      url: "/admin/donation",
      icon: IconCreditCard,
    },
    {
      title: "Sponsorship & Payments",
      url: "/admin/sponsor-plans",
      icon: IconCreditCard,
      items: [
        {
          title: "Sponsor Directory",
          url: "/admin/sopnsor",
        },
        {
          title: "Sponsor Plans",
          url: "/admin/sponsor-plans",
        },
      ],
    },
    {
      title: "Events Manager",
      url: "/admin/events",
      icon: IconCalendarEvent,
    },
    {
      title: "Webinar Library",
      url: "/admin/webinars",
      icon: IconVideo,
    },
    {
      title: "Communications",
      url: "/admin/communications",
      icon: IconMail,
    },
  ],
  boardMenu: [
    {
      title: "Board Room Home",
      url: "/board",
      icon: IconDashboard,
    },
    {
      title: "Board Meetings",
      url: "/board/meetings",
      icon: IconPresentation,
    },
    {
      title: "Governance Docs",
      url: "/board/documents",
      icon: IconFileText,
    },
    {
      title: "Financial Reports",
      url: "/board/financials",
      icon: IconReceipt2,
    },
    {
      title: "Committees",
      url: "/board/committees",
      icon: IconHierarchy,
    },
    {
      title: "Internal Planning",
      url: "/board/planning",
      icon: IconBriefcase,
    },
    {
      title: "Collaboration Tools",
      url: "/board/collaboration",
      icon: IconUsers,
    },
  ],
  pastoralMenu: [
    {
      title: "Learning Library",
      url: "/portal/resources/learning",
      icon: IconBooks,
    },
    {
      title: "Catechetical Tools",
      url: "/portal/resources/catechetical",
      icon: IconSchool,
    },
    {
      title: "Pastoral Leadership",
      url: "/portal/resources/leadership",
      icon: IconAward,
    },
    {
      title: "Ministry Toolkits",
      url: "/portal/resources/toolkits",
      icon: IconBriefcase,
    },
    {
      title: "Parish & Diocese Resources",
      url: "/portal/resources/ministry",
      icon: IconHierarchy,
    },
    {
      title: "Advanced Webinars",
      url: "/portal/webinars/advanced",
      icon: IconVideo,
    },
    {
      title: "Special Pastoral Resources",
      url: "/portal/resources/special",
      icon: IconFileText,
    },
  ],
  generalMenu: [
    {
      title: "Dashboard Home",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Announcements",
      url: "/portal/announcements",
      icon: IconBell,
    },
    {
      title: "Member Events",
      url: "/portal/events",
      icon: IconCalendarEvent,
    },
    {
      title: "Webinars",
      url: "/portal/webinars",
      icon: IconVideo,
    },
    {
      title: "Basic Resources",
      url: "/portal/resources/basic",
      icon: IconFileText,
    },
  ],
  navSecondary: [
    {
      title: "General FCH Documents",
      url: "/portal/documents",
      icon: IconFileText,
    },
    {
      title: "Newsletter Archive",
      url: "/portal/news",
      icon: IconMail,
    },
    {
      title: "My Profile",
      url: "/portal/profile",
      icon: IconUser,
    },
    {
      title: "Settings",
      url: "/portal/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/search",
      icon: IconSearch,
    },
  ],
}
