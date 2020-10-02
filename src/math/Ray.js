import { Vector3 } from './Vector3.js';

/**
 * @author bhouston / http://clara.io
 */

function Ray( origin, direction ) {

	this.origin = ( origin !== undefined ) ? origin : new Vector3();
	this.direction = ( direction !== undefined ) ? direction : new Vector3();

}

Object.assign( Ray.prototype, {

	set: function ( origin, direction ) {

		this.origin.copy( origin );
		this.direction.copy( direction );

		return this;

	},

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( ray ) {

		this.origin.copy( ray.origin );
		this.direction.copy( ray.direction );

		return this;

	},

	at: function ( t, target ) {

		if ( target === undefined ) {

			console.warn( 'THREE.Ray: .at() target is now required' );
			target = new Vector3();

		}

		return target.copy( this.direction ).multiplyScalar( t ).add( this.origin );

	},

	lookAt: function ( v ) {

		this.direction.copy( v ).sub( this.origin ).normalize();

		return this;

	},

	recast: function () {

		var v1 = new Vector3();

		return function recast( t ) {

			this.origin.copy( this.at( t, v1 ) );

			return this;

		};

	}(),

	closestPointToPoint: function ( point, target ) {

		if ( target === undefined ) {

			console.warn( 'THREE.Ray: .closestPointToPoint() target is now required' );
			target = new Vector3();

		}

		target.subVectors( point, this.origin );

		var directionDistance = target.dot( this.direction );

		if ( directionDistance < 0 ) {

			return target.copy( this.origin );

		}

		return target.copy( this.direction ).multiplyScalar( directionDistance ).add( this.origin );

	},

	distanceToPoint: function ( point ) {

		return Math.sqrt( this.distanceSqToPoint( point ) );

	},

	distanceSqToPoint: function () {

		var v1 = new Vector3();

		return function distanceSqToPoint( point ) {

			var directionDistance = v1.subVectors( point, this.origin ).dot( this.direction );

			// point behind the ray

			if ( directionDistance < 0 ) {

				return this.origin.distanceToSquared( point );

			}

			v1.copy( this.direction ).multiplyScalar( directionDistance ).add( this.origin );

			return v1.distanceToSquared( point );

		};

	}(),

	distanceSqToSegment: function () {

		var segCenter = new Vector3();
		var segDir = new Vector3();
		var diff = new Vector3();

		return function distanceSqToSegment( v0, v1, optionalPointOnRay, optionalPointOnSegment ) {

			// from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteDistRaySegment.h
			// It returns the min distance between the ray and the segment
			// defined by v0 and v1
			// It can also set two optional targets :
			// - The closest point on the ray
			// - The closest point on the segment

			segCenter.copy( v0 ).add( v1 ).multiplyScalar( 0.5 );
			segDir.copy( v1 ).sub( v0 ).normalize();
			diff.copy( this.origin ).sub( segCenter );

			var segExtent = v0.distanceTo( v1 ) * 0.5;
			var a01 = - this.direction.dot( segDir );
			var b0 = diff.dot( this.direction );
			var b1 = - diff.dot( segDir );
			var c = diff.lengthSq();
			var det = Math.abs( 1 - a01 * a01 );
			var s0, s1, sqrDist, extDet;

			if ( det > 0 ) {

				// The ray and segment are not parallel.

				s0 = a01 * b1 - b0;
				s1 = a01 * b0 - b1;
				extDet = segExtent * det;

				if ( s0 >= 0 ) {

					if ( s1 >= - extDet ) {

						if ( s1 <= extDet ) {

							// region 0
							// Minimum at interior points of ray and segment.

							var invDet = 1 / det;
							s0 *= invDet;
							s1 *= invDet;
							sqrDist = s0 * ( s0 + a01 * s1 + 2 * b0 ) + s1 * ( a01 * s0 + s1 + 2 * b1 ) + c;

						} else {

							// region 1

							s1 = segExtent;
							s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
							sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

						}

					} else {

						// region 5

						s1 = - segExtent;
						s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
						sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

					}

				} else {

					if ( s1 <= - extDet ) {

						// region 4

						s0 = Math.max( 0, - ( - a01 * segExtent + b0 ) );
						s1 = ( s0 > 0 ) ? - segExtent : Math.min( Math.max( - segExtent, - b1 ), segExtent );
						sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

					} else if ( s1 <= extDet ) {

						// region 3

						s0 = 0;
						s1 = Math.min( Math.max( - segExtent, - b1 ), segExtent );
						sqrDist = s1 * ( s1 + 2 * b1 ) + c;

					} else {

						// region 2

						s0 = Math.max( 0, - ( a01 * segExtent + b0 ) );
						s1 = ( s0 > 0 ) ? segExtent : Math.min( Math.max( - segExtent, - b1 ), segExtent );
						sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

					}

				}

			} else {

				// Ray and segment are parallel.

				s1 = ( a01 > 0 ) ? - segExtent : segExtent;
				s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
				sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

			}

			if ( optionalPointOnRay ) {

				optionalPointOnRay.copy( this.direction ).multiplyScalar( s0 ).add( this.origin );

			}

			if ( optionalPointOnSegment ) {

				optionalPointOnSegment.copy( segDir ).multiplyScalar( s1 ).add( segCenter );

			}

			return sqrDist;

		};

	}(),

	intersectSphere: function () {

		var v1 = new Vector3();

		return function intersectSphere( sphere, target ) {

			v1.subVectors( sphere.center, this.origin );
			var tca = v1.dot( this.direction );
			var d2 = v1.dot( v1 ) - tca * tca;
			var radius2 = sphere.radius * sphere.radius;

			if ( d2 > radius2 ) return null;

			var thc = Math.sqrt( radius2 - d2 );

			// t0 = first intersect point - entrance on front of sphere
			var t0 = tca - thc;

			// t1 = second intersect point - exit point on back of sphere
			var t1 = tca + thc;

			// test to see if both t0 and t1 are behind the ray - if so, return null
			if ( t0 < 0 && t1 < 0 ) return null;

			// test to see if t0 is behind the ray:
			// if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
			// in order to always return an intersect point that is in front of the ray.
			if ( t0 < 0 ) return this.at( t1, target );

			// else t0 is in front of the ray, so return the first collision point scaled by t0
			return this.at( t0, target );

		};

	}(),

	intersectsSphere: function ( sphere ) {

		return this.distanceSqToPoint( sphere.center ) <= ( sphere.radius * sphere.radius );

	},

	distanceToPlane: function ( plane ) {

		var denominator = plane.normal.dot( this.direction );

		if ( denominator === 0 ) {

			// line is coplanar, return origin
			if ( plane.distanceToPoint( this.origin ) === 0 ) {

				return 0;

			}

			// Null is preferable to undefined since undefined means.... it is undefined

			return null;

		}

		var t = - ( this.origin.dot( plane.normal ) + plane.constant ) / denominator;

		// Return if the ray never intersects the plane

		return t >= 0 ? t : null;

	},

	intersectPlane: function ( plane, target ) {

		var t = this.distanceToPlane( plane );

		if ( t === null ) {

			return null;

		}

		return this.at( t, target );

	},

	intersectsPlane: function ( plane ) {

		// check if the ray lies on the plane first

		var distToPoint = plane.distanceToPoint( this.origin );

		if ( distToPoint === 0 ) {

			return true;

		}

		var denominator = plane.normal.dot( this.direction );

		if ( denominator * distToPoint < 0 ) {

			return true;

		}

		// ray origin is behind the plane (and is pointing behind it)

		return false;

	},

	intersectBox: function ( box, target ) {

		var tmin, tmax, tymin, tymax, tzmin, tzmax;

		var invdirx = 1 / this.direction.x,
			invdiry = 1 / this.direction.y,
			invdirz = 1 / this.direction.z;

		var origin = this.origin;

		if ( invdirx >= 0 ) {

			tmin = ( box.min.x - origin.x ) * invdirx;
			tmax = ( box.max.x - origin.x ) * invdirx;

		} else {

			tmin = ( box.max.x - origin.x ) * invdirx;
			tmax = ( box.min.x - origin.x ) * invdirx;

		}

		if ( invdiry >= 0 ) {

			tymin = ( box.min.y - origin.y ) * invdiry;
			tymax = ( box.max.y - origin.y ) * invdiry;

		} else {

			tymin = ( box.max.y - origin.y ) * invdiry;
			tymax = ( box.min.y - origin.y ) * invdiry;

		}

		if ( ( tmin > tymax ) || ( tymin > tmax ) ) return null;

		// These lines also handle the case where tmin or tmax is NaN
		// (result of 0 * Infinity). x !== x returns true if x is NaN

		if ( tymin > tmin || tmin !== tmin ) tmin = tymin;

		if ( tymax < tmax || tmax !== tmax ) tmax = tymax;

		if ( invdirz >= 0 ) {

			tzmin = ( box.min.z - origin.z ) * invdirz;
			tzmax = ( box.max.z - origin.z ) * invdirz;

		} else {

			tzmin = ( box.max.z - origin.z ) * invdirz;
			tzmax = ( box.min.z - origin.z ) * invdirz;

		}

		if ( ( tmin > tzmax ) || ( tzmin > tmax ) ) return null;

		if ( tzmin > tmin || tmin !== tmin ) tmin = tzmin;

		if ( tzmax < tmax || tmax !== tmax ) tmax = tzmax;

		//return point closest to the ray (positive side)

		if ( tmax < 0 ) return null;

		return this.at( tmin >= 0 ? tmin : tmax, target );

	},

	intersectsBox: ( function () {

		var v = new Vector3();

		return function intersectsBox( box ) {

			return this.intersectBox( box, v ) !== null;

		};

	} )(),

	intersectTriangle: function () {

		// Compute the offset origin, edges, and normal.
		var diff = new Vector3();
		var edge1 = new Vector3();
		var edge2 = new Vector3();
		var normal = new Vector3();

		return function intersectTriangle( a, b, c, backfaceCulling, target ) {

			// from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h

			edge1.subVectors( b, a );
			edge2.subVectors( c, a );
			normal.crossVectors( edge1, edge2 );

			// Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
			// E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
			//   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
			//   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
			//   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
			var DdN = this.direction.dot( normal );
			var sign;

			if ( DdN > 0 ) {

				if ( backfaceCulling ) return null;
				sign = 1;

			} else if ( DdN < 0 ) {

				sign = - 1;
				DdN = - DdN;

			} else {

				return null;

			}

			diff.subVectors( this.origin, a );
			var DdQxE2 = sign * this.direction.dot( edge2.crossVectors( diff, edge2 ) );

			// b1 < 0, no intersection
			if ( DdQxE2 < 0 ) {

				return null;

			}

			var DdE1xQ = sign * this.direction.dot( edge1.cross( diff ) );

			// b2 < 0, no intersection
			if ( DdE1xQ < 0 ) {

				return null;

			}

			// b1+b2 > 1, no intersection
			if ( DdQxE2 + DdE1xQ > DdN ) {

				return null;

			}

			// Line intersects triangle, check if ray does.
			var QdN = - sign * diff.dot( normal );

			// t < 0, no intersection
			if ( QdN < 0 ) {

				return null;

			}

			// Ray intersects triangle.
			return this.at( QdN / DdN, target );

		};

	}(),

	intersectCone: function () {

		// static variables for the function
		var E = new Vector3();
		var target2 = new Vector3();

		return function ( cone, target ) {

			// Set up the quadratic Q(t) = c2*t^2 + 2*c1*t + c0 that corresponds to
			// the cone.  Let the vertex be V, the unit-length direction vector be A,
			// and the angle measured from the cone axis to the cone wall be Theta,
			// and define g = cos(Theta).  A point X is on the cone wall whenever
			// Dot(A,(X-V)/|X-V|) = g.  Square this equation and factor to obtain
			//   (X-V)^T * (A*A^T - g^2*I) * (X-V) = 0
			// where the superscript T denotes the transpose operator.  This defines
			// a double-sided cone.  The line is L(t) = P + t*D, where P is the line
			// origin and D is a unit-length direction vector.  Substituting
			// X = L(t) into the cone equation above leads to Q(t) = 0.  Since we
			// want only intersection points on the single-sided cone that lives in
			// the half-space pointed to by A, any point L(t) generated by a root of
			// Q(t) = 0 must be tested for Dot(A,L(t)-V) >= 0.

			var cos_angle = cone.cosTheta;
			var AdD = cone.axis.dot( this.direction );
			var cos_sqr = cos_angle * cos_angle;
			E.subVectors( this.origin, cone.v );
			var AdE = cone.axis.dot( E );
			var DdE = this.direction.dot( E );
			var EdE = E.dot( E );
			var c2 = AdD * AdD - cos_sqr;
			var c1 = AdD * AdE - cos_sqr * DdE;
			var c0 = AdE * AdE - cos_sqr * EdE;
			var dot;

			// Solve the quadratic.  Keep only those X for which Dot(A,X-V) >= 0.
			if ( Math.abs( c2 ) >= 0 ) {

				// c2 != 0
				var discr = c1 * c1 - c0 * c2;
				if ( discr < 0 ) {

					// Q(t) = 0 has no real-valued roots.  The line does not
					// intersect the double-sided cone.
					return null;

				} else if ( discr > 0 ) {

					// Q(t) = 0 has two distinct real-valued roots.  However, one or
					// both of them might intersect the portion of the double-sided
					// cone "behind" the vertex.  We are interested only in those
					// intersections "in front" of the vertex.
					var root = Math.sqrt( discr );
					var invC2 = 1 / c2;
					var quantity = 0;

					var t = ( - c1 - root ) * invC2;
					if ( t > 0 ) {

						this.at( t, target );

						E.subVectors( target, cone.v );
						dot = E.dot( cone.axis );
						if ( dot > cone.inf && dot < cone.sup ) {

							quantity ++;

						}

					}

					var t2 = ( - c1 + root ) * invC2;
					if ( t2 > 0 && t2 < t ) {

						this.at( t2, target2 );

						E.subVectors( target2, cone.v );
						dot = E.dot( cone.axis );
						if ( dot > cone.inf && dot < cone.sup ) {

							quantity ++;
							target.copy( target2 );

						}

					}

					if ( quantity === 2 ) {

						// The line intersects the single-sided cone in front of the
						// vertex twice.
						return target;

					} else if ( quantity === 1 ) {

						// The line intersects the single-sided cone in front of the
						// vertex once.  The other intersection is with the
						// single-sided cone behind the vertex.
						return target;

					} else {

						// The line intersects the single-sided cone behind the vertex
						// twice.
						return null;

					}

				} else {

					// One repeated real root (line is tangent to the cone).
					var t = c1 / c2;
					this.at( t, target );

					E.subVectors( target, cone.v );
					dot = E.dot( cone.axis );
					if ( dot > cone.inf && dot < cone.sup ) {

						return target;

					} else {

						return null;

					}

				}

			} else if ( Math.abs( c1 ) >= 0 ) {

				// c2 = 0, c1 != 0 (D is a direction vector on the cone boundary)

				var t = 0.5 * c0 / c1;
				this.at( t, target );

				E.subVectors( target, cone.v );
				dot = E.dot( cone.axis );
				if ( dot > cone.inf && dot < cone.sup ) {

					return target;

				} else {

					return null;

				}

			} else {

				// c2 = c1 = 0, c0 != 0
				// OR
				// c2 = c1 = c0 = 0, cone contains ray V+t*D where V is cone vertex
				// and D is the line direction.
				return null;

			}

		};

	}(),

	/**
	 *
	 * Compute intersections of a ray with a cylinder.
	 *
	 * @param {!Object} cyl a cylinder truncated which must define :
	 *      cyl.v       Origin of the cylinder
	 *      cyl.axis    Axis of the cylinder, unit lengthed and oriented
	 *      cyl.r       Radius of the cylinder
	 *      cyl.inf     All points P such that Dot(axis,P-v) < inf are not considered in the cylinder
	 *      cyl.sup     All points P such that Dot(axis,P-v) > sup are not considered in the cylinder
	 *  IMPORTANT NOTE : the cylinder is considered truncated but NOT CLOSED. So caps are not tested.
	 *                   However, you MUST use this function as if caps do exists.
	 *                   So that If someone (you?) is in a situation where caps matters it is possible to
	 *                   improve this algorithm without risking to break anything.
	 * @param {!Cylinder} cyl
	 * @param {!Vector3} target Where to save the resulting hit point, if any.
	 * @return {Vector3} The first hit point if any, null otherwise.
	 *
	 */
	intersectCylinder: function () {

		// function static variables
		var vtos = new Vector3();
		var tmp = new Vector3();
		var tmp1 = new Vector3();
		var tmp2 = new Vector3();

		return function ( cyl, target ) {

			vtos.subVectors( this.origin, cyl.v );
			var vtos_dot_ax = vtos.dot( cyl.axis );
			var dir_dot_ax = this.direction.dot( cyl.axis );

			tmp1.set(
				this.direction.x - dir_dot_ax * cyl.axis.x,
				this.direction.y - dir_dot_ax * cyl.axis.y,
				this.direction.z - dir_dot_ax * cyl.axis.z );
			tmp2.set(
				vtos.x - vtos_dot_ax * cyl.axis.x,
				vtos.y - vtos_dot_ax * cyl.axis.y,
				vtos.z - vtos_dot_ax * cyl.axis.z );

			var a = tmp1.lengthSq();
			var b = 2 * tmp1.dot( tmp2 );
			var c = tmp2.lengthSq() - cyl.radius * cyl.radius;

			var delta = b * b - 4 * a * c;
			if ( delta < 0 ) {

				return null;

			} else if ( delta === 0 ) {

				var t = ( - b - Math.sqrt( delta ) ) / ( 2 * a );
				this.at( t, target );

				tmp.subVectors( target, cyl.v );
				var dot = tmp.dot( cyl.axis );
				if ( t > 0 && dot > cyl.inf && dot < cyl.sup ) {

					return target;

				} else {

					return null;

				}

			} else {

				var sqrt_d = Math.sqrt( delta );
				var t = ( - b - sqrt_d ) / ( 2 * a );
				this.at( t, target );

				tmp.subVectors( target, cyl.v );
				var dot = tmp.dot( cyl.axis );
				if ( t < 0 || dot < cyl.inf || dot > cyl.sup ) {

					t = Number.MAX_VALUE;

				}

				var t2 = ( - b + sqrt_d ) / ( 2 * a );
				this.at( t2, tmp2 );

				tmp.subVectors( tmp2, cyl.v );
				dot = tmp.dot( cyl.axis );
				if ( t2 > 0 && dot > cyl.inf && dot < cyl.sup ) {

					if ( t2 < t ) {

						t = t2;
						target.copy( tmp2 );

					}

				}

				if ( t !== Number.MAX_VALUE )
					return target;
				else
					return null;

			}

		};

	}(),

	applyMatrix4: function ( matrix4 ) {

		this.origin.applyMatrix4( matrix4 );
		this.direction.transformDirection( matrix4 );

		return this;

	},

	equals: function ( ray ) {

		return ray.origin.equals( this.origin ) && ray.direction.equals( this.direction );

	}

} );


export { Ray };
