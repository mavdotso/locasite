

const EMAIL_REGEX =
	/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const SUBDOMAIN_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

const PHONE_REGEX =
	/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;

export function validateEmail(email: string): {
	valid: boolean;
	error?: string;
} {
	if (!email) {
		return { valid: false, error: "Email is required" };
	}

	const trimmedEmail = email.trim();

	if (trimmedEmail.length > 254) {
		return { valid: false, error: "Email address is too long" };
	}

	const atIndex = trimmedEmail.lastIndexOf("@");
	if (atIndex === -1) {
		return { valid: false, error: "Invalid email format" };
	}

	const localPart = trimmedEmail.substring(0, atIndex);
	const domainPart = trimmedEmail.substring(atIndex + 1).toLowerCase();
	const normalizedEmail = localPart + "@" + domainPart;

	if (!EMAIL_REGEX.test(normalizedEmail)) {
		return { valid: false, error: "Invalid email format" };
	}

	const disposableDomains = [
		"tempmail.com",
		"throwaway.email",
		"guerrillamail.com",
		"mailinator.com",
		"10minutemail.com",
		"trashmail.com",
		"temporarymail.net",
		"fakeinbox.com",
		"sharklasers.com",
		"guerrillamail.info",
		"guerrillamail.biz",
		"guerrillamail.org",
		"guerrillamail.de",
	];

	for (const disposable of disposableDomains) {
		if (domainPart === disposable || domainPart.endsWith("." + disposable)) {
			return {
				valid: false,
				error: "Disposable email addresses are not allowed",
			};
		}
	}

	return { valid: true };
}

export function validateSubdomain(subdomain: string): {
	valid: boolean;
	error?: string;
} {
	if (!subdomain) {
		return { valid: false, error: "Subdomain is required" };
	}

	const trimmed = subdomain.trim().toLowerCase();

	if (trimmed.length === 0) {
		return { valid: false, error: "Subdomain cannot be empty" };
	}

	if (trimmed.length < 3) {
		return {
			valid: false,
			error: "Subdomain must be at least 3 characters long",
		};
	}

	if (trimmed.length > 63) {
		return { valid: false, error: "Subdomain must be less than 63 characters" };
	}

	if (!SUBDOMAIN_REGEX.test(trimmed)) {
		return {
			valid: false,
			error:
				"Subdomain can only contain lowercase letters, numbers, and hyphens (not at the start or end)",
		};
	}

	if (/--/.test(trimmed)) {
		return {
			valid: false,
			error: "Subdomain cannot contain consecutive hyphens",
		};
	}

	const reserved = [
		"www",
		"api",
		"app",
		"admin",
		"mail",
		"ftp",
		"blog",
		"shop",
		"store",
		"help",
		"support",

		"dashboard",
		"account",
		"login",
		"signup",
		"oauth",
		"auth",
		"sso",
		"cdn",
		"static",

		"email",
		"smtp",
		"pop",
		"imap",
		"webmail",
		"cpanel",
		"whm",
		"host",
		"server",
		"ns1",
		"ns2",
		"dev",
		"staging",
		"test",
		"demo",
		"beta",
		"git",
		"svn",
		"faq",
		"news",
		"media",
		"assets",
	];

	if (reserved.includes(trimmed)) {
		return { valid: false, error: "This subdomain is reserved" };
	}

	return { valid: true };
}

export function validateUrl(url: string): { valid: boolean; error?: string } {
	if (!url) {
		return { valid: true }; // URLs are often optional
	}

	const trimmed = url.trim();

	try {
		const parsed = new URL(trimmed);

		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
			return { valid: false, error: "URL must use http or https protocol" };
		}

		return { valid: true };
	} catch {
		return { valid: false, error: "Invalid URL format" };
	}
}

export function validatePhone(phone: string): {
	valid: boolean;
	error?: string;
} {
	if (!phone) {
		return { valid: true }; // Phone numbers are often optional
	}

	const cleaned = phone.replace(/\s/g, "");

	if (!PHONE_REGEX.test(cleaned)) {
		return { valid: false, error: "Invalid phone number format" };
	}

	return { valid: true };
}

export function validateDomain(domain: string): {
	valid: boolean;
	error?: string;
} {
	if (!domain) {
		return { valid: false, error: "Domain is required" };
	}

	const trimmed = domain.trim().toLowerCase();

	const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
	if (ipRegex.test(trimmed)) {
		return {
			valid: false,
			error: "IP addresses are not allowed as custom domains",
		};
	}

	const domainRegex = /^([a-z0-9]+([a-z0-9\-]*[a-z0-9])?\.)+[a-z]{2,}$/;
	const punycodeRegex = /^(xn--[a-z0-9]+\.)+[a-z]{2,}$/;

	if (!domainRegex.test(trimmed) && !punycodeRegex.test(trimmed)) {
		return { valid: false, error: "Invalid domain format" };
	}

	const parts = trimmed.split(".");
	for (const part of parts) {
		if (part.length > 63) {
			return {
				valid: false,
				error: "Domain labels cannot exceed 63 characters",
			};
		}
		if (part.startsWith("-") || part.endsWith("-")) {
			return {
				valid: false,
				error: "Domain labels cannot start or end with hyphens",
			};
		}
	}

	return { valid: true };
}

export function sanitizeInput(input: string): string {
	if (!input) return "";

	return input
		.trim()
		.replace(/[<>]/g, "") // Remove HTML tags
		.replace(/javascript:/gi, "") // Remove javascript: protocol
		.replace(/vbscript:/gi, "") // Remove vbscript: protocol
		.replace(/data:text\/html/gi, "") // Remove data: protocol for HTML
		.replace(/data:.*?script/gi, "") // Remove data: protocol with script
		.replace(/on\w+\s*=/gi, "") // Remove event handlers
		.replace(/&#/g, "") // Remove HTML entity encoding
		.replace(/\\x[0-9a-fA-F]{2}/g, "") // Remove hex encoding
		.replace(/\\u[0-9a-fA-F]{4}/g, ""); // Remove unicode encoding
}

export function validateBusinessName(name: string): {
	valid: boolean;
	error?: string;
} {
	if (!name) {
		return { valid: false, error: "Business name is required" };
	}

	const trimmed = name.trim();

	if (trimmed.length < 2) {
		return {
			valid: false,
			error: "Business name must be at least 2 characters",
		};
	}

	if (trimmed.length > 100) {
		return {
			valid: false,
			error: "Business name must be less than 100 characters",
		};
	}

	const inappropriate = ["xxx", "porn", "sex"];
	const lowerName = trimmed.toLowerCase();

	for (const word of inappropriate) {
		if (lowerName.includes(word)) {
			return {
				valid: false,
				error: "Business name contains inappropriate content",
			};
		}
	}

	return { valid: true };
}
