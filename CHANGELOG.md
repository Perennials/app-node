1.2
===

- Big refactoring of `HttpApp`. Request are not handled in the App class
  anymore but have their own `HttpAppRequest` instance.

1.1
===

- Renamed `App.shutdown()` to `App.close()`.
- Renamed `App.cleanup()` to `App.onClose()`.
- Started keeping changelog.