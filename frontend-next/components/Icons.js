/** Shared stroke icons — no emoji. size defaults to 20. */
export function Icon({ children, size = 20, className = '', ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

const stroke = {
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconHoney(props) {
  return (
    <Icon {...props}>
      <path d="M8 10h8l-1 10H9L8 10Z" {...stroke} />
      <path d="M9 10V8a3 3 0 0 1 6 0v2" {...stroke} />
      <path d="M10 14h4" {...stroke} />
    </Icon>
  )
}

export function IconPackage(props) {
  return (
    <Icon {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" {...stroke} />
      <path d="M3.3 7 12 12l8.7-5" {...stroke} />
      <path d="M12 22V12" {...stroke} />
    </Icon>
  )
}

export function IconSearch(props) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="7" {...stroke} />
      <path d="m20 20-3.5-3.5" {...stroke} />
    </Icon>
  )
}

export function IconCart(props) {
  return (
    <Icon {...props}>
      <path d="M6 6h15l-1.5 9h-12L6 6Z" {...stroke} />
      <path d="M6 6 5 3H2" {...stroke} />
      <circle cx="9" cy="20" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.25" fill="currentColor" stroke="none" />
    </Icon>
  )
}

export function IconUser(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="4" {...stroke} />
      <path d="M4 20c1.5-3.5 4-5 8-5s6.5 1.5 8 5" {...stroke} />
    </Icon>
  )
}

export function IconChat(props) {
  return (
    <Icon {...props}>
      <path
        d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 1 1 18 0Z"
        {...stroke}
      />
    </Icon>
  )
}

export function IconLeaf(props) {
  return (
    <Icon {...props}>
      <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14Z" {...stroke} />
      <path d="M5 19c2-6 6-10 12-12" {...stroke} />
    </Icon>
  )
}

export function IconTruck(props) {
  return (
    <Icon {...props}>
      <path d="M1 7h13v10H1z" {...stroke} />
      <path d="M14 10h4l3 3v4h-7v-7Z" {...stroke} />
      <circle cx="5.5" cy="18.5" r="1.5" {...stroke} />
      <circle cx="17.5" cy="18.5" r="1.5" {...stroke} />
    </Icon>
  )
}

export function IconPhone(props) {
  return (
    <Icon {...props}>
      <rect x="7" y="2" width="10" height="20" rx="2" {...stroke} />
      <path d="M11 18h2" {...stroke} />
    </Icon>
  )
}

export function IconHive(props) {
  return (
    <Icon {...props}>
      <path d="M12 3 19 7v4l-7 4-7-4V7l7-4Z" {...stroke} />
      <path d="M5 11v4l7 4 7-4v-4" {...stroke} />
      <path d="M12 11v12" {...stroke} />
    </Icon>
  )
}

export function IconGrid(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" {...stroke} />
      <rect x="14" y="3" width="7" height="7" rx="1" {...stroke} />
      <rect x="3" y="14" width="7" height="7" rx="1" {...stroke} />
      <rect x="14" y="14" width="7" height="7" rx="1" {...stroke} />
    </Icon>
  )
}

export function IconList(props) {
  return (
    <Icon {...props}>
      <path d="M8 6h13M8 12h13M8 18h13" {...stroke} />
      <path d="M3 6h.01M3 12h.01M3 18h.01" {...stroke} />
    </Icon>
  )
}

export function IconUsers(props) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="8" r="3.5" {...stroke} />
      <path d="M2 20c1-3 3.5-4.5 7-4.5" {...stroke} />
      <circle cx="17" cy="9" r="2.5" {...stroke} />
      <path d="M14 20c.8-2.2 2.4-3.5 5-3.5" {...stroke} />
    </Icon>
  )
}

export function IconLayers(props) {
  return (
    <Icon {...props}>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" {...stroke} />
      <path d="m3 12 9 5 9-5" {...stroke} />
      <path d="m3 17 9 5 9-5" {...stroke} />
    </Icon>
  )
}

export function IconWallet(props) {
  return (
    <Icon {...props}>
      <rect x="2" y="6" width="20" height="14" rx="2" {...stroke} />
      <path d="M2 10h20" {...stroke} />
      <circle cx="16" cy="15" r="1.25" fill="currentColor" stroke="none" />
    </Icon>
  )
}

export function IconSettings(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="3" {...stroke} />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        {...stroke}
      />
    </Icon>
  )
}

export function IconArrowLeft(props) {
  return (
    <Icon {...props}>
      <path d="M19 12H5M11 18l-6-6 6-6" {...stroke} />
    </Icon>
  )
}

export function IconEye(props) {
  return (
    <Icon {...props}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" {...stroke} />
      <circle cx="12" cy="12" r="3" {...stroke} />
    </Icon>
  )
}

export function IconEyeOff(props) {
  return (
    <Icon {...props}>
      <path d="M3 3l18 18" {...stroke} />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" {...stroke} />
      <path
        d="M9.9 5.1A10.5 10.5 0 0 1 12 5c6 0 10 7 10 7a17.7 17.7 0 0 1-4.1 4.6"
        {...stroke}
      />
      <path
        d="M6.1 6.1C3.7 7.8 2 12 2 12s4 7 10 7a10.4 10.4 0 0 0 4.2-.9"
        {...stroke}
      />
    </Icon>
  )
}

export function IconCheck(props) {
  return (
    <Icon {...props}>
      <path d="M20 6 9 17l-5-5" {...stroke} />
    </Icon>
  )
}

export function IconActivity(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="8" {...stroke} />
    </Icon>
  )
}

export function IconCurrency(props) {
  return (
    <Icon {...props}>
      <path d="M12 3v18M16 7H9.5a3 3 0 0 0 0 6H14a3 3 0 0 1 0 6H7" {...stroke} />
    </Icon>
  )
}
