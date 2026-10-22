export function ErrorAlert({ error, onRetry }) {
  return (
    <div className="alert alert-danger d-flex justify-content-between align-items-center gap-3 mb-0" role="alert">
      <span>{error?.message ?? 'Неизвестная ошибка'}</span>
      {onRetry && (
        <button type="button" className="btn btn-sm btn-outline-danger flex-shrink-0" onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  )
}

export function EmptyState({ children }) {
  return <div className="alert alert-secondary mb-0">{children}</div>
}
