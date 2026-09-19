import React from "react";
import StandardHeader from "../../StandardK2/StandardHeader";

/**
 * Header used by the auth / units / dashboard surfaces.
 *
 * It is the same header as the public StandardK2 pages — one navigation, one
 * implementation — with the two extras those surfaces need turned on:
 * the selected FPO's branding in place of the K2 logo, and the account
 * management actions (admin settings, delete account) in the profile menu.
 */
const Header = (props) => <StandardHeader unitBranding accountActions {...props} />;

export default Header;
