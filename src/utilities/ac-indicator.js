import { AcClasses } from '@utils';

export class AcIndicator {
  constructor($navigation, $indicator, routes, classNames, vertical = false) {
    this.$navigation = $navigation.current;
    this.$indicator = $indicator.current;
    this.routes = routes;
    this.classNames = classNames;

    this.active = 0;

    this.vertical = vertical;
    this.start = vertical ? 'top' : 'left';
    this.end = vertical ? 'bottom' : 'right';

    this.last_direction = this.start;
    this.direction = this.start;
    this.position = vertical
      ? { top: 0, bottom: '100%' }
      : {
          left: 0,
          right: '100%',
        };

    this.Classes = new AcClasses();

    return this;
  }

  init = async () => {
    return await this.addEvents();
  };

  addEvents = async () => {
    return await this.unload().then(() => {
      let n = 0;
      let len = this.routes.length;

      for (n; n < len; n++) {
        const route = this.routes[n];

        if (route !== 'break') {
          route.index = n;

          if (route.$ref) {
            route.$ref.addEventListener(
              'click',
              (event) => {
                this.recalculate(event, route);
              },
              { passive: true }
            );
          }
        }
      }
    });
  };

  unload = () => {
    return new Promise((resolve) => {
      let n = 0;
      let len = this.routes.length;

      for (n; n < len; n++) {
        const route = this.routes[n];

        if (route.$ref) {
          route.$ref.removeEventListener(
            'click',
            (event) => {
              this.recalculate(event, route);
            },
            { passive: true }
          );
        }
      }

      resolve(this);
    });
  };

  update = (routes) => {
    this.routes = routes;
    return this;
  };

  reset = () => {
    return this.unload().then(() => {
      this.active = 0;
      this.direction = this.start;
      this.position = this.vertical
        ? { top: 0, bottom: '100%' }
        : {
            left: 0,
            right: '100%',
          };

      this.move();
    });
  };

  recalculate = (event, route) => {
    if (route.disabled) return;
    if (!route.$ref) return;
    if (window.outerWidth <= 480) return;

    const offset = this.$navigation.getBoundingClientRect();
    const rect = route.$ref.getBoundingClientRect();

    const target = {
      [this.start]: rect[this.start] - offset[this.start],
      [this.end]: offset[this.end] - rect[this.end],
    };

    this.active = route.index;

    const direction =
      this.position[this.start] > target[this.start]
        ? this.start
        : this.position[this.start] < target[this.start]
        ? this.end
        : this.start;

    this.position[this.start] = target[this.start];
    this.position[this.end] = target[this.end];
    this.direction = direction;

    this.move();
  };

  updateClasses = () => {
    return new Promise((resolve) => {
      if (this.direction !== this.last_direction) {
        if (this.direction === this.start) {
          this.Classes.removeClass(this.$indicator, this.classNames.RIGHT);
          this.Classes.addClass(this.$indicator, this.classNames.LEFT);
        } else if (this.direction === this.end) {
          this.Classes.removeClass(this.$indicator, this.classNames.LEFT);
          this.Classes.addClass(this.$indicator, this.classNames.RIGHT);
        }
        this.last_direction = this.direction;
      }

      resolve();
    });
  };

  move = () => {
    if (!this.$indicator) return;

    this.updateClasses().then(() => {
      const start =
        this.position[this.start] === '100%'
          ? this.position[this.start]
          : `${this.position[this.start]}px`;

      const end =
        this.position[this.end] === '100%'
          ? this.position[this.end]
          : `${this.position[this.end]}px`;

      if (this.vertical) {
        this.$indicator.setAttribute('style', `top: ${start}; bottom: ${end}`);
      } else {
        this.$indicator.setAttribute('style', `left: ${start}; right: ${end}`);
      }
    });
  };
}
