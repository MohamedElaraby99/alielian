import { ApiError } from "../utils/ApiError.js";

/**
 * Middleware to ensure device fingerprinting is present in authentication requests
 * This helps prevent unauthorized access and ensures proper device tracking
 */
export const requireDeviceFingerprint = (req, res, next) => {
    const { deviceInfo } = req.body;

    if (!deviceInfo) {
        return next(new ApiError(
            400,
            "Device information is required for security purposes. Please enable JavaScript and try again.",
            "DEVICE_INFO_MISSING"
        ));
    }

    // Support both object and stringified JSON (from multipart/form-data via multer)
    let parsedDeviceInfo = deviceInfo;
    if (typeof parsedDeviceInfo === 'string') {
        try {
            parsedDeviceInfo = JSON.parse(parsedDeviceInfo);
        } catch (e) {
            return next(new ApiError(
                400,
                "Invalid device information format. Please refresh the page and try again.",
                "INVALID_DEVICE_INFO"
            ));
        }
    }

    // Validate basic device info structure
    if (!parsedDeviceInfo.platform || !parsedDeviceInfo.screenResolution || !parsedDeviceInfo.timezone) {
        return next(new ApiError(
            400,
            "Invalid device information format. Please refresh the page and try again.",
            "INVALID_DEVICE_INFO"
        ));
    }

    // Normalize back into req.body for downstream handlers
    req.body.deviceInfo = parsedDeviceInfo;

    next();
};

/**
 * Middleware to log device fingerprinting attempts for security monitoring
 */
export const logDeviceFingerprint = (req, res, next) => {
    const { deviceInfo } = req.body;

    if (deviceInfo) {
        console.log('=== DEVICE FINGERPRINT LOG ===');
        console.log('Endpoint:', req.originalUrl);
        console.log('Method:', req.method);
        console.log('User Agent:', req.get('User-Agent'));
        console.log('IP Address:', req.ip);
        console.log('Device Platform:', typeof deviceInfo === 'object' ? deviceInfo.platform : deviceInfo);
        console.log('Screen Resolution:', typeof deviceInfo === 'object' ? deviceInfo.screenResolution : 'unknown');
        console.log('Timezone:', typeof deviceInfo === 'object' ? deviceInfo.timezone : 'unknown');
        console.log('Timestamp:', new Date().toISOString());
        console.log('================================');
    }

    next();
};
