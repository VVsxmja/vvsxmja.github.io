import type PaginatorNavLinkType from "@theme/PaginatorNavLink";
import type { WrapperProps } from "@docusaurus/types";
import { Fragment } from "react";

type Props = WrapperProps<typeof PaginatorNavLinkType>;

export default function PaginatorNavLinkWrapper(_: Props): JSX.Element {
  return <Fragment />;
}
