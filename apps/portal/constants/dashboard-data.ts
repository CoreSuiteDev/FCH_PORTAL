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
  IconMessage,
  IconPresentation,
  IconReceipt2,
  IconSchool,
  IconSearch,
  IconSettings,
  IconUser,
  IconUsers,
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
      title: "News Manager",
      url: "/admin/news",
      icon: IconFileText,
      items: [
        {
          title: "Manage News",
          url: "/admin/news",
        },
        {
          title: "Manage Authors",
          url: "/admin/news/authors",
        },
      ],
    },
    {
      title: "Events Manager",
      url: "/admin/events",
      icon: IconCalendarEvent,
      items: [
        {
          title: "Manage Events",
          url: "/admin/events",
        },
        {
          title: "Manage Categories",
          url: "/admin/events/categories",
        },
      ],
    },
    {
      title: "Resources Manager",
      url: "/admin/resources",
      icon: IconBooks,
    },
    {
      title: "Communications",
      url: "/admin/communications",
      icon: IconMail,
    },
    {
      title: "Inquiries",
      url: "/admin/inquiries/contact",
      icon: IconMessage,
      items: [
        {
          title: "Contact Inquiries",
          url: "/admin/inquiries/contact",
        },
        {
          title: "Newsletter Subscribers",
          url: "/admin/inquiries/newsletter",
        },
      ],
    },
  ],
  boardMenu: [
    {
      title: "Board Overview",
      url: "/portal/board",
      icon: IconDashboard,
    },
    {
      title: "Board Meetings",
      url: "/portal/board/meetings",
      icon: IconPresentation,
    },
    {
      title: "Governance Docs",
      url: "/portal/board/documents",
      icon: IconFileText,
    },
    {
      title: "Financial Reports",
      url: "/portal/board/financials",
      icon: IconReceipt2,
    },
  ],
  pastoralMenu: [
    {
      title: "Pastoral Overview",
      url: "/portal/pastoral",
      icon: IconDashboard,
    },
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
      title: "Special Pastoral Resources",
      url: "/portal/resources/special",
      icon: IconFileText,
    },
    {
      title: "Events & Webinars",
      url: "/portal/events",
      icon: IconCalendarEvent,
    },
  ],
  generalMenu: [
    {
      title: "General Overview",
      url: "/portal/general",
      icon: IconDashboard,
    },
    {
      title: "Events & Webinars",
      url: "/portal/events",
      icon: IconCalendarEvent,
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
      title: "Account",
      url: "/portal/account",
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
