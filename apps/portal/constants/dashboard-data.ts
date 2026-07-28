import {
  IconAward,
  IconBell,
  IconBooks,
  IconCalendarEvent,
  IconCreditCard,
  IconDashboard,
  IconFileText,
  IconHelp,
  IconLockSquare,
  IconMail,
  IconMessage,
  IconPresentation,
  IconReceipt2,
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
      title: "Board Meeting Manager",
      url: "/admin/board-meetings",
      icon: IconPresentation,
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
      url: "/board",
      icon: IconDashboard,
    },
    {
      title: "News & Publications",
      url: "/news",
      icon: IconMail,
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
  ],
  pastoralMenu: [
    {
      title: "Pastoral Overview",
      url: "/pastoral",
      icon: IconDashboard,
    },
    {
      title: "News & Publications",
      url: "/news",
      icon: IconMail,
    },
    {
      title: "Learning Library",
      url: "/resources/learning",
      icon: IconBooks,
    },
    {
      title: "Special Pastoral Resources",
      url: "/resources/special",
      icon: IconFileText,
    },
    {
      title: "Events & Webinars",
      url: "/events",
      icon: IconCalendarEvent,
    },
  ],
  generalMenu: [
    {
      title: "General Overview",
      url: "/general",
      icon: IconDashboard,
    },
    {
      title: "News & Publications",
      url: "/news",
      icon: IconMail,
    },
    {
      title: "Events & Webinars",
      url: "/events",
      icon: IconCalendarEvent,
    },
  ],
  navSecondary: [
    {
      title: "Newsletter Archive",
      url: "/news",
      icon: IconMail,
    },
    {
      title: "Account",
      url: "/account",
      icon: IconUser,
    },
    {
      title: "Settings",
      url: "/settings",
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
