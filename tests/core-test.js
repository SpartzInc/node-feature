jest.dontMock('core');

describe('feature library', function() {

    var _core = require('core');
    var _roller = require('roller');

    var _featureConfig = {
        'feature_a': 0,
        'feature_b': 100,
        'feature_c': {
            'variant_a': 0,
            'variant_b': 20,
            'variant_c': 20,
            'variant_d': 60
        },
        'feature_d': {
            'variant_a': 10,
            'variant_b': 10
        },
        'feature_e': {},
        'feature_f': {
            'variant_a': -100
        },
        'feature_g': {
            'variant_a': 'test'
        }
    };

    _core.setFeatures(_featureConfig);

    it('throws an error when configuration is invalid', function() {
        expect(function() {
            _core.setFeatures('Not and Object');
        }).toThrow();
    });

    it('gets null for feature with no variants', function() {
        expect(_core.getVariant('context', 'feature_e')).toEqual(null);
    });

    it('gets on variant for enabled features', function() {
        expect(_core.getVariant('context', 'feature_b')).toEqual('on');
    });

    it('gets null variant for disabled features', function() {
        expect(_core.getVariant('context', 'feature_a')).toEqual(null);
    });

    it('normalizes negative odds to 0', function() {
        _roller.roll.mockReturnValue(0);
        expect(_core.getVariant('context', 'feature_f')).toEqual(null);
    });

    it('normalizes NaN odds to 0', function() {
        _roller.roll.mockReturnValue(0);
        expect(_core.getVariant('context', 'feature_g')).toEqual(null);
    });

    it('gets null for undefined feature', function() {
        expect(_core.getVariant('context', 'feature_x')).toEqual(null);
    });

    it('gets a cached variant', function() {
        _roller.roll.mockReturnValue(10);
        expect(_core.getVariant('context', 'feature_c')).toEqual('variant_b');

        _roller.roll.mockReturnValue(90);
        expect(_core.getVariant('context', 'feature_c')).toEqual('variant_b');
    });

    it('gets a variant for each context individually', function() {
        _roller.roll.mockReturnValue(10);
        expect(_core.getVariant('context_a', 'feature_c')).toEqual('variant_b');

        _roller.roll.mockReturnValue(30);
        expect(_core.getVariant('context_b', 'feature_c')).toEqual('variant_c');

        _roller.roll.mockReturnValue(50);
        expect(_core.getVariant('context_c', 'feature_c')).toEqual('variant_d');

        _roller.roll.mockReturnValue(99.9);
        expect(_core.getVariant('context_d', 'feature_c')).toEqual('variant_d');
    });

    it('gets null if no variant wins', function() {
        _roller.roll.mockReturnValue(30);
        expect(_core.getVariant('context', 'feature_d')).toEqual(null);
    });
});
