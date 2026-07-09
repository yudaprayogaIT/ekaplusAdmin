export default function DriverTourStyles() {
  return (
    <style>{`
      .app-driver-popover {
        width: 320px !important;
        max-width: calc(100vw - 32px) !important;
        padding: 0 !important;
        border-radius: 18px !important;
        background: #ffffff !important;
        box-shadow:
          0 20px 45px rgba(15, 23, 42, 0.18),
          0 6px 18px rgba(15, 23, 42, 0.08) !important;
        border: 1px solid rgba(226, 232, 240, 0.9) !important;
        overflow: hidden !important;
        font-family: inherit !important;
      }

      .app-driver-popover * {
        font-family: inherit !important;
        box-sizing: border-box !important;
      }

      .app-driver-popover .driver-popover-title {
        margin: 0 !important;
        padding: 18px 84px 4px 20px !important;
        color: #0f172a !important;
        font-size: 17px !important;
        line-height: 1.35 !important;
        font-weight: 800 !important;
        letter-spacing: -0.02em !important;
        display: block !important;
        white-space: normal !important;
        word-break: break-word !important;
      }

      .app-driver-popover .driver-popover-description {
        margin: 0 !important;
        padding: 8px 20px 16px 20px !important;
        color: #475569 !important;
        font-size: 14px !important;
        line-height: 1.65 !important;
        font-weight: 400 !important;
      }

      .app-driver-popover .driver-popover-footer {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 12px !important;
        padding: 0 20px 18px 20px !important;
        margin: 0 !important;
      }

      .app-driver-popover .driver-popover-progress-text {
        background: #fff1f2 !important;
        color: #e11d48 !important;
        border-radius: 999px !important;
        padding: 6px 10px !important;
        font-size: 11px !important;
        font-weight: 800 !important;
        line-height: 1 !important;
        letter-spacing: 0.04em !important;
        text-transform: uppercase !important;
      }

      .app-driver-popover .driver-popover-navigation-btns {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
      }

      .app-driver-popover .driver-popover-btn {
        min-width: auto !important;
        border-radius: 12px !important;
        padding: 10px 15px !important;
        font-size: 13px !important;
        line-height: 1 !important;
        font-weight: 800 !important;
        text-shadow: none !important;
        transition:
          transform 0.15s ease,
          box-shadow 0.15s ease,
          background 0.15s ease !important;
      }

      .app-driver-popover .driver-popover-next-btn,
      .app-driver-popover .driver-popover-done-btn {
        background: #e30613 !important;
        color: #ffffff !important;
        border: 1px solid #e30613 !important;
        box-shadow: 0 8px 18px rgba(227, 6, 19, 0.22) !important;
      }

      .app-driver-popover .driver-popover-next-btn:hover,
      .app-driver-popover .driver-popover-done-btn:hover {
        background: #c9000b !important;
        border-color: #c9000b !important;
        transform: translateY(-1px) !important;
      }

      .app-driver-popover .driver-popover-prev-btn {
        background: #f8fafc !important;
        color: #334155 !important;
        border: 1px solid #e2e8f0 !important;
      }

      .app-driver-popover .driver-popover-prev-btn:hover {
        background: #f1f5f9 !important;
      }

      .app-driver-popover .driver-popover-close-btn {
        top: 14px !important;
        right: 16px !important;
        width: auto !important;
        height: auto !important;
        padding: 0 !important;
        border-radius: 999px !important;
        color: #64748b !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        line-height: 1 !important;
        text-align: center !important;
        background: transparent !important;
        transition: color 0.15s ease !important;
      }

      .app-driver-popover .driver-popover-close-btn:hover {
        background: transparent !important;
        color: #0f172a !important;
      }

      .app-driver-popover .driver-popover-arrow {
        border: none !important;
      }

      .driver-overlay {
        background: rgba(15, 23, 42, 0.38) !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      .driver-active-element,
      .driver-active-element * {
        pointer-events: auto !important;
      }

      .driver-active-element {
        border-radius: 18px !important;
        box-shadow:
          0 0 0 4px rgba(255, 255, 255, 0.95),
          0 0 0 8px rgba(227, 6, 19, 0.18),
          0 18px 45px rgba(15, 23, 42, 0.22) !important;
      }

      @media (max-width: 640px) {
        .app-driver-popover {
          width: calc(100vw - 28px) !important;
          border-radius: 16px !important;
        }

        .app-driver-popover .driver-popover-title {
          font-size: 16px !important;
          padding: 16px 74px 4px 18px !important;
        }

        .app-driver-popover .driver-popover-description {
          font-size: 13px !important;
          padding: 8px 18px 14px 18px !important;
        }

        .app-driver-popover .driver-popover-footer {
          padding: 0 18px 16px 18px !important;
        }
      }
    `}</style>
  );
}
