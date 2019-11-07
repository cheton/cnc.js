import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Line extends Component {
    static propTypes = {
        style: PropTypes.object,
        vertical: PropTypes.bool,
        color: PropTypes.string,
        opacity: PropTypes.number,
        length: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        width: PropTypes.number
    };

    static defaultProps = {
        vertical: false,
        color: '#fff',
        opacity: 0.8,
        length: 0,
        width: 1
    };

    render() {
        const { style, vertical, color, opacity, length, width, ...props } = this.props;

        let componentStyle = {
            boxShadow: '0 0 2px #333',
            opacity: opacity,
        };

        if (vertical) {
            componentStyle.borderLeftColor = color;
            componentStyle.borderLeftStyle = 'solid';
            componentStyle.borderLeftWidth = width;
            componentStyle.height = length;
        } else {
            componentStyle.borderTopColor = color;
            componentStyle.borderTopStyle = 'solid';
            componentStyle.borderTopWidth = width;
            componentStyle.width = length;
        }

        componentStyle = { ...componentStyle, ...style };

        return (
            <div {...props} style={componentStyle} />
        );
    }
}

export default Line;