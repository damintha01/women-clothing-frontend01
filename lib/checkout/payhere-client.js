const SDK_URL = "https://www.payhere.lk/lib/payhere.js";

let sdkPromise;

/** Loads payhere.js exactly once and caches the promise across the checkout session. */
function loadPayHereSDK() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("PayHere can only be loaded in the browser."));
  }
  if (window.payhere) {
    return Promise.resolve(window.payhere);
  }
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${SDK_URL}"]`);
      const script = existing ?? document.createElement("script");
      script.src = SDK_URL;
      script.onload = () => {
        if (window.payhere) resolve(window.payhere);
        else reject(new Error("PayHere failed to load."));
      };
      script.onerror = () => reject(new Error("PayHere failed to load."));
      if (!existing) document.body.appendChild(script);
    });
  }
  return sdkPromise;
}

/** Opens PayHere's hosted checkout popup for an already-created order's payload. */
export async function startPayHerePayment(payload, callbacks) {
  const payhere = await loadPayHereSDK();
  payhere.onCompleted = callbacks.onCompleted;
  payhere.onDismissed = callbacks.onDismissed;
  payhere.onError = callbacks.onError;
  payhere.startPayment(payload);
}
