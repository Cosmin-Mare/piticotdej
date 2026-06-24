import Link from "next/link";

export default function SecondaryPageLink({ href, children = "Editează textele paginii →" }) {
  return (
    <p className="admin-secondary-link">
      <Link href={href}>{children}</Link>
    </p>
  );
}
