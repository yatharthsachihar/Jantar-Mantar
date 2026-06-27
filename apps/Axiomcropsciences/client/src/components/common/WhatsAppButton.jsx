import { useSettings } from "../../context/SettingsContext";
import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppButton.css";

/**
 * Floating WhatsApp icon — fixed to the bottom-right of the viewport.
 * Reads its link from admin settings using the shared WhatsApp fallback chain.
 * Only renders when a WhatsApp link has been configured in the admin panel.
 *
 * Uses api.whatsapp.com/send instead of wa.me to avoid the intermediate
 * "Starting chat" loading/redirect screen that causes a visible delay.
 */
export default function WhatsAppButton() {
  const { settings } = useSettings();

  const link = settings.whatsappNumber || settings.socialLinks?.whatsapp || settings.storePhone || "";

  if (!link) return null;

  const defaultMessage = settings.whatsappDefaultMessage || "";

  const justDigits = link.replace(/\D/g, "");
  const finalLink = `https://api.whatsapp.com/send?phone=${justDigits}&text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={finalLink}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <FaWhatsapp className="whatsapp-float-icon" />
    </a>
  );
}
