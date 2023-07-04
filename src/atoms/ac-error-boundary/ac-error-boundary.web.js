// Imports => Controller
import AcErrorBoundaryController from './ac-error-boundary.controller';

class AcErrorBoundary extends AcErrorBoundaryController {
  render() {
    return this.props.children;
  }
}

export default AcErrorBoundary;
