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
      url: "/dashboard/admin/overview",
      icon: IconDashboard,
    },
    {
      title: "Manage Users",
      url: "/dashboard/admin/users",
      icon: IconUsers,
    },
    {
      title: "Board Access",
      url: "/dashboard/admin/board-management",
      icon: IconLockSquare,
    },
    {
      title: "Payments & Stripe",
      url: "/dashboard/admin/payments",
      icon: IconCreditCard,
    },
    {
      title: "Events Manager",
      url: "/dashboard/admin/events-manager",
      icon: IconCalendarEvent,
    },
    {
      title: "Webinar Library",
      url: "/dashboard/admin/webinar-library",
      icon: IconVideo,
    },
    {
      title: "Communications",
      url: "/dashboard/admin/communications",
      icon: IconMail,
    },
  ],
  boardMenu: [
    {
      title: "Board Meetings",
      url: "/dashboard/board/meetings",
      icon: IconPresentation,
    },
    {
      title: "Governance Docs",
      url: "/dashboard/board/documents",
      icon: IconFileText,
    },
    {
      title: "Financial Reports",
      url: "/dashboard/board/financials",
      icon: IconReceipt2,
    },
    {
      title: "Committees",
      url: "/dashboard/board/committees",
      icon: IconHierarchy,
    },
  ],
  pastoralMenu: [
    {
      title: "Learning Library",
      url: "/dashboard/learning-library",
      icon: IconBooks,
    },
    {
      title: "Catechetical Tools",
      url: "/dashboard/resources/catechetical",
      icon: IconSchool,
    },
    {
      title: "Pastoral Leadership",
      url: "/dashboard/resources/pastoral-leadership",
      icon: IconAward,
    },
    {
      title: "Ministry Toolkits",
      url: "/dashboard/toolkits",
      icon: IconBriefcase,
    },
  ],
  generalMenu: [
    {
      title: "Dashboard Home",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Announcements",
      url: "/dashboard/announcements",
      icon: IconBell,
    },
    {
      title: "Member Events",
      url: "/dashboard/events",
      icon: IconCalendarEvent,
    },
    {
      title: "Webinars",
      url: "/dashboard/webinars",
      icon: IconVideo,
    },
    {
      title: "Basic Resources",
      url: "/dashboard/resources/basic",
      icon: IconFileText,
    },
    {
      title: "My Profile",
      url: "/dashboard/profile",
      icon: IconUser,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/dashboard/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/dashboard/search",
      icon: IconSearch,
    },
  ],
}
